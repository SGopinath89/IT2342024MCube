import React, { useState, useEffect } from 'react';
import './ListOrder.css'; // Import your CSS file

const ListOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch('http://localhost:4000/order/allorders', {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data.data); // Assuming data.data contains the array of enriched orders
        } else {
          console.error('Failed to fetch orders');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="orders">
      <h2>All Orders (Admin View)</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order">
              <h3>Order ID: {order._id}</h3>
              <p>Amount: ${order.amount}</p>
              <p>Address: {order.address}</p>
              <p>Payment Method: {order.payment}</p>
              <p>Status: {order.status}</p>
              <p>Ordered Date: {new Date(order.createdAt).toLocaleString()}</p>
              <h4>Products:</h4>
              <ul>
                {order.items.map((item) => (
                  <li key={item.productId}>
                    <img src={item.image} alt={item.name} className="product-image" />
                    <p>Name: {item.name}</p>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListOrder;
