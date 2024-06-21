//CartItems.jsx

import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
    const { all_product, cartItems, removeFromCart, createOrder } = useContext(ShopContext);

    const calculateSubtotal = () => {
        return all_product.reduce((sum, product) => {
            return sum + (product.new_price * (cartItems[product.id] || 0));
        }, 0).toFixed(2);
    };

    const subtotal = calculateSubtotal();
    const shippingFee = 0; // Assuming shipping is free
    const total = (parseFloat(subtotal) + shippingFee).toFixed(2);

    const handleProceedToCheckout = () => {
        if (Object.keys(cartItems).length === 0) {
            alert('Your cart is empty. Please add items before proceeding.');
            return;
        }

        // Call createOrder function from context to create an order
        createOrder();
    };

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_product.map((e) => {
                if (cartItems[e.id] > 0) {
                    return (
                        <div key={e.id}>
                            <div className="cartitems-format cartitems-format-main">
                                <img src={e.image} alt={e.name} className='carticon-producticon' />
                                <p>{e.name}</p>
                                <p>${e.new_price}</p>
                                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                                <p>${(e.new_price * cartItems[e.id]).toFixed(2)}</p>
                                <img className='cartitems-remove-icon' src={remove_icon} onClick={() => removeFromCart(e.id)} alt="Remove" />
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Total</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${subtotal}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${total}</h3>
                        </div>
                    </div>
                    <button onClick={handleProceedToCheckout}>Proceed To Checkout</button>
                </div>
                <div className="cartitems-promocode">
                    <p>If you have a promo code, enter it here</p>
                    <div className='cartitems-promobox'>
                        <input type="text" placeholder='Promo code' />
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItems;
