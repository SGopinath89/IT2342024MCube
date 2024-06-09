import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all'); // New state for category filter

  const fetchInfo = async (category = 'all') => {
    try {
      const response = await fetch('http://localhost:4000/product/allproducts');
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      if (category === 'all') {
        
        setAllProducts(data);
      } else {
        setAllProducts(data.filter(product => product.category === category));
      }
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
        setAllProducts(allProducts.filter(product => product.id !== id));
      } else {
        alert("Failed to remove product");
      }
    } catch (error) {
      console.error("Failed to remove product:", error);
    }
  };

  useEffect(() => {
    fetchInfo(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div>
        <label htmlFor="category">Filter by Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kid">Kids</option>
        </select>
      </div>
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
        {allProducts.map((product, index) => {
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
