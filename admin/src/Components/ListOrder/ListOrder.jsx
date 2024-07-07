import React, { useEffect, useState } from 'react';
import './ListOrder.css';
import remove_icon from '../../assets/cart_cross_icon.png';

const ListOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [extendedOrders, setExtendedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await fetch('http://localhost:4000/order/allorders', {
          method: "GET",
          headers: {
            'auth-token': localStorage.getItem('auth-token'),
            'Content-Type': 'application/json',
          }
        });

        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await res.json();
        setAllOrders(data.data);
      } catch (error) {
        console.error('Failed to fetch all orders:', error);
        setError('Failed to fetch all orders');
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  useEffect(() => {
    const fetchItemDetails = async (orders) => {
      try {
        const extendedOrdersData = await Promise.all(orders.map(async (order) => {
          const products = Object.entries(order.items[0]);
          const productDetails = await Promise.all(products.map(async ([productId, quantity]) => {
            const res = await fetch(`http://localhost:4000/product/allproducts/${productId}`);
            if (!res.ok) {
              throw new Error("Item not found");
            }
            const data = await res.json();
            return {
              quantity,
              image: data[0]?.image,
              price: data[0]?.new_price,
              name: data[0]?.name
            };
          }));
          return {
            ...order,
            productDetails
          };
        }));
        setExtendedOrders(extendedOrdersData);
      } catch (error) {
        console.error('Failed to fetch item details:', error);
        setError('Failed to fetch item details');
      }
    };

    if (allOrders.length) {
      fetchItemDetails(allOrders);
    }
  }, [allOrders]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const updateOrderStatus = async () => {
    try {
      const res = await fetch('http://localhost:4000/order/status', {
        method: "POST",
        headers: {
          'auth-token': localStorage.getItem('auth-token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder._id,
          status: newStatus
        })
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      if (data.success) {
        setAllOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder._id ? { ...order, status: newStatus } : order
          )
        );
        setShowModal(false);
        setSelectedOrder(null);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      setError('Failed to update order status');
    }
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="list-orders">
      <h2>All Orders</h2><br />
      {allOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          <div className="order-list-header">
            <p>Order ID</p>
            <p>Name</p>
            <p>Status</p>
            <p>Amount</p>
            <p>Actions</p>
          </div>
          <div className="order-list-details">
            
            {extendedOrders.map((order) => (
              <div key={order._id} className="listproduct-format-main listproduct-format">
                <p>{order._id}</p>
                <p>{order.name}</p>
                <p>{order.status}</p>
                <p>${order.amount?.toFixed(2)}</p>
                <button className="listproduct-edit-button" onClick={() => handleViewOrder(order)}>View</button>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && selectedOrder && (
        <div className="modal-background">
          <div className="edit-product-form">
            <div className="modal-header">
              <h3>Order ID: {selectedOrder._id}</h3>
              <button className="close-modal" onClick={closeModal}>
                <img src={remove_icon} alt="Close" className="close-icon" />
              </button>
            </div>
            <div>
            
              <p>Total Amount: ${selectedOrder.amount?.toFixed(2)}</p>
              <p>Shippin Address: {selectedOrder.address}</p>
              <p>Payment Status: {selectedOrder.payment ? 'Paid' : 'Pending'}</p>
              <p>Ordered Date: {formatDate(selectedOrder.date)}</p>
            </div>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.productDetails.map((item, index) => {
                  let total = item.price * item.quantity;
                  return (
                    <tr key={index}>
                      <td className="product-info">
                        {item.image && <img src={item.image} alt="product" className="product-image" />}
                        <span>{item.name || 'Unknown'}</span>
                      </td>
                      <td>{item.quantity}</td>
                      <td>${item.price?.toFixed(2) || 'N/A'}</td>
                      <td>${total?.toFixed(2) || 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="status-update">
              <label htmlFor="status">Update Status: </label>
              <select id="status" value={newStatus} onChange={handleStatusChange}>
                <option value="Order Pending">Order Pending</option>
                <option value="Order Processing">Order Processing</option>
                <option value="Order Shipped">Order Shipped</option>
                <option value="Order Delivered">Order Delivered</option>
              </select>
              <button onClick={updateOrderStatus}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOrders;
