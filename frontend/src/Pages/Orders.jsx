import React, { useContext, useEffect, useState } from 'react';
import './CSS/Orders.css';
import { ShopContext } from '../Context/ShopContext';
import remove_icon from '../Components/Assets/cart_cross_icon.png';

const Orders = () => {
  const { orders, fetchUserOrders, loading } = useContext(ShopContext);
  const [extendedOrders, setExtendedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

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
            const product = data[0]; // Ensure product data is accessed correctly
            return {
              quantity,
              image: product.image,
              price: product.new_price,
              name: product.name
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
      }
    };

    if (orders.length) {
      fetchItemDetails(orders);
    }
  }, [orders]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const cancelOrder = async (orderId) => {
    const confirmed = window.confirm('Are you sure you want to cancel the order?');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:4000/order/cancelorder/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        fetchUserOrders(); // Refresh orders after cancellation
        closeModal(); // Close modal after cancellation
      } else {
        alert(data.message); // Display error message if cancellation failed
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="orders">
      <h2>My Orders</h2><br />
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="order-list">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {extendedOrders.map((order) => (
                <tr key={order._id} className="order-summary">
                  <td>{order._id}</td>
                  <td>{order.status}</td>
                  <td>${order.amount.toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleViewOrder(order)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Order ID: {selectedOrder._id}</h3>
              <button className="close-modal" onClick={closeModal}>
                <img src={remove_icon} alt="Close" className="close-icon" />
              </button>
            </div>
            <p>Total Amount: ${selectedOrder.amount.toFixed(2)}</p><br />
            <p>Payment Method: {selectedOrder.payment ? 'Paid' : 'Pending'}</p><br />
            <p>Status: {selectedOrder.status}</p><br />
            <p>Ordered Date: {new Date(selectedOrder.date).toLocaleString()}</p>
            <br />
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
                        <img src={item.image} alt="product" className="product-image" />
                        <span>{item.name}</span>
                      </td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${total.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <button className="cancelBtn" onClick={() => cancelOrder(selectedOrder._id)}>Cancel Order</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
