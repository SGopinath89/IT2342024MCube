import React, { useContext, useState } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';


const CartItems = () => {
    const { all_product, cartItems, removeFromCart, clearCart } = useContext(ShopContext);
    const [showPopup, setShowPopup] = useState(false);
    const [formData, setFormData] = useState({
        items: '',
        amount: '',
        address: '',
        hasPaymentDetails: false // New state for payment details
    });

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

        console.log(cartItems);

        setFormData({
            items: cartItems,
            amount: subtotal,
            address: '',
            hasPaymentDetails: false // Initialize as false
        });

        setShowPopup(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;

        setFormData({ ...formData, [name]: inputValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem('auth-token'); // Retrieve JWT token from localStorage
    
        const orderData = {
            items: formData.items,
            amount: parseFloat(formData.amount),
            address: formData.address,
            payment: formData.hasPaymentDetails // Ensure payment details are included
        };
    
        try {
            const response = await fetch('http://localhost:4000/order/createorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token // Include JWT token in headers
                },
                body: JSON.stringify(orderData)
            });
    
            const responseData = await response.json();
    
            if (response.ok) {
                alert("Order submitted successfully!");
                setShowPopup(false);
                clearCart(); // Clear the cart after successful order submission
            } else {
                alert(`Failed to submit order: ${responseData.message}`);
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            alert("Error submitting order. Please try again.");
        }
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

            {showPopup && (
                <div className="overlay">
                    <div className="popup">
                        <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
                        <h2>Shipping Details</h2>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="address">Address:</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            /><br /><br />

    

                            <h2>Payment Details</h2>

                            <div className="input-container">
                                <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    maxLength={19}
                                    required
                                    placeholder="Card Number"
                                />
                            </div>

                            <div className="input-container">
                                <input
                                    type="text"
                                    id="expiryDate"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    pattern="^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$"
                                    placeholder="Expiry Date (MM/YYYY)"
                                    required
                                />
                            </div>

                            <div className="input-container">
                                <input
                                    type="text"
                                    id="cvv"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleInputChange}
                                    pattern="\d{3}"
                                    required
                                    placeholder="CVV"
                                />
                            </div>

                            <div className="input-container">
                                <input
                                    type="text"
                                    id="cardHolderName"
                                    name="cardHolderName"
                                    value={formData.cardHolderName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Card Holder Name"
                                />
                            </div>
                            <br /><br />
                            <button type="submit">Submit Order</button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default CartItems;