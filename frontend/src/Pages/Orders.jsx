import React, { useContext, useEffect, useState } from 'react';
import './CSS/Orders.css'; // Import your CSS file
import { ShopContext } from '../Context/ShopContext';
import remove_icon from '../Components/Assets/cart_cross_icon.png'; // Import your remove icon

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
            return {
              quantity,
              image: data[0].image,
              price: data[0].new_price,
              name: data[0].name
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

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="orders">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="order-list">
          {extendedOrders.map((order) => (
            <div key={order._id} className="order-summary">
              <p>Order ID: {order._id}</p>
              <p>Status: {order.status}</p>
              <p>Amount: ${order.amount.toFixed(2)}</p>
              <button onClick={() => handleViewOrder(order)}>View</button>
            </div>
          ))}
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
            <p>Amount: ${selectedOrder.amount.toFixed(2)}</p>
            <p>Payment Method: {selectedOrder.payment ? 'Paid' : 'Pending'}</p>
            <p>Status: {selectedOrder.status}</p>
            <p>Ordered Date: {new Date(selectedOrder.date).toLocaleString()}</p>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.productDetails.map((item, index) => (
                  <tr key={index}>
                    <td className="product-info">
                      <img src={item.image} alt="product" className="product-image" />
                      <span>{item.name}</span>
                    </td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
