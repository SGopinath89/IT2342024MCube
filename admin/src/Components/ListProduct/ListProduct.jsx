import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/allproducts');
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await fetch('http://localhost:4000/removeproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        setAllProducts(allproducts.filter(product => product.id !== id));
      } else {
        alert("Failed to remove product");
      }
    } catch (error) {
      console.error("Failed to remove product:", error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => {
          return (
            <div key={index} className="listproduct-format-main listproduct-format">
              <img src={product.image} alt="" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img
                className='listproduct-remove-icon'
                src={cross_icon}
                alt="Remove"
                onClick={() => removeProduct(product.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListProduct;
