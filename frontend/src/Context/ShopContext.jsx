import React, { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);


const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState({});

    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        } else {
            // Fetch cart data from the server if it doesn't exist in local storage
            fetch('http://localhost:4000/getcart', {
                method: "POST",
                headers: {
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => response.json())
            .then((data) => setCartItems(data))
            .catch((error) => console.error('Failed to fetch cart data:', error));
        }
    
        // Fetch products from the server
        fetch('http://localhost:4000/allproducts')
            .then((Response) => Response.json())
            .then((data) => setAll_Product(data))
            .catch((error) => console.error('Failed to fetch products:', error));
    }, []);

    const addToCart = (itemId) => {
        if (!localStorage.getItem('auth-token')) {
            alert("You must login to purchase");
            return; // Return early if user is not logged in
        }
    
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));
    
        localStorage.setItem('cartItems', JSON.stringify({
            ...cartItems,
            [itemId]: (cartItems[itemId] || 0) + 1
        }));
    
        fetch('http://localhost:4000/addtocart', {
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
            fetch('http://localhost:4000/removefromcart', {
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
    }

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
    }

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }

    useEffect(() => {
        console.log(cartItems);
    }, [cartItems]);

    const contextValue = { 
        getTotalCartItems, 
        getTotalCartAmount, 
        all_product, 
        cartItems, 
        addToCart, 
        removeFromCart, 
        clearCart
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
