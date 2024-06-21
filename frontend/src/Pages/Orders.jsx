import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import './CSS/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { getTotalCartItems } = useContext(ShopContext);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await fetch('http://localhost:4000/order/userorders', {
          method: "GET",
          headers: {
            'auth-token': localStorage.getItem('auth-token'),
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOrders(data); // Set the orders state with fetched data
      } catch (error) {
        console.error('Failed to fetch user orders:', error);
      }
    };

    fetchUserOrders();
  }, []);

  return (
    <div className="orders-page">
      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map(order => (
            <li key={order._id}>
              <h3>Order ID: {order._id}</h3>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              {order.user && (
                <div>
                  <p>User Name: {order.user.name}</p>
                  <p>User Email: {order.user.email}</p>
                </div>
              )}
              <p>Ordered Products:</p>
              <ul>
                {order.product_ids.map(product => (
                  <li key={product._id}>
                    {product.productId && (
                      <>
                        <p>Product Name: {product.productId.name}</p>
                        <p>Quantity: {product.quantity}</p>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Orders;
