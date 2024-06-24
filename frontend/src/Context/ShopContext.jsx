import React, { createContext, useState, useEffect, useCallback } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        } else {
            const authToken = localStorage.getItem('auth-token');
            if (authToken) {
                fetch('http://localhost:4000/user/getcart', {
                    method: "POST",
                    headers: {
                        'auth-token': authToken,
                        'Content-Type': 'application/json',
                    }
                })
                .then((response) => response.json())
                .then((data) => setCartItems(data))
                .catch((error) => console.error('Failed to fetch cart data:', error));
            }
        }
        
        fetch('http://localhost:4000/product/allproducts')
            .then((response) => response.json())
            .then((data) => setAll_Product(data))
            .catch((error) => console.error('Failed to fetch products:', error));
    }, []);

    const addToCart = (itemId) => {
        if (!localStorage.getItem('auth-token')) {
            alert("You must login to purchase");
            return; 
        }
    
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));
    
        localStorage.setItem('cartItems', JSON.stringify({
            ...cartItems,
            [itemId]: (cartItems[itemId] || 0) + 1
        }));
    
        fetch('http://localhost:4000/user/addtocart', {
            method: "POST",
            headers: {
                'auth-token': `${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "itemId": itemId }),
        })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Failed to add to cart:', error));
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
        }));

        localStorage.setItem('cartItems', JSON.stringify({
            ...cartItems,
            [itemId]: Math.max((cartItems[itemId] || 0) - 1, 0)
        }));

        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/user/removefromcart', {
                method: "POST",
                headers: {
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "itemId": itemId }),
            })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error('Failed to remove from cart:', error));
        }
    };

    const clearCart = () => {
        setCartItems({});
        localStorage.removeItem('cartItems');
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                totalAmount += itemInfo.new_price * cartItems[item];
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    const createOrder = () => {
        if (!localStorage.getItem('auth-token')) {
            alert("You must login to place an order");
            return; 
        }
    
        const orderData = {
            order_id: `ORD${Date.now()}`,
            product_ids: Object.keys(cartItems).map(id => parseInt(id)),
        };
    
        fetch('http://localhost:4000/order/createorder', {
            method: "POST",
            headers: {
                'auth-token': localStorage.getItem('auth-token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                clearCart();
                console.log('Order created successfully:', data.order);
                fetchUserOrders();
            } else {
                console.error('Failed to create order:', data.message);
            }
        })
        .catch((error) => console.error('Failed to create order:', error));
    };

    const fetchUserOrders = useCallback(async () => {
        setLoading(true);

        if (!localStorage.getItem('auth-token')) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:4000/order/myorders', {
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
            setOrders(data.data);
        } catch (error) {
            console.error('Failed to fetch user orders:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const contextValue = {
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
        createOrder,
        clearCart,
        orders,
        fetchUserOrders,
        loading
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;
