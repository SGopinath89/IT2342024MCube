import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    old_price: '',
    new_price: '',
    category: 'women',
    description: '',
    image: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

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
    const confirmation = window.confirm("Are you sure you want to delete this product?");
    if (!confirmation) return;
  
    try {
      const response = await fetch('http://localhost:4000/product/removeproduct', {
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

  const editProduct = (product) => {
    setEditingProduct(product.id);
    setFormData({
      id: product.id,
      name: product.name,
      old_price: product.old_price,
      new_price: product.new_price,
      category: product.category,
      description: product.description,
      image: product.image
    });
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/product/updateproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        setAllProducts(allProducts.map(product => product.id === formData.id ? formData : product));
        setEditingProduct(null);
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  useEffect(() => {
    fetchInfo(selectedCategory);
  }, [selectedCategory]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div>
        <label htmlFor="category">Filter by Category: </label>
        <select
          className="category-selector"
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kid">Kids</option>
        </select>
        <label className='search' htmlFor="search">Search Product : </label>
        <input
        className='category-selector'
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearch}
         />
      </div>
      
        
  
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
        <p>Edit</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {filteredProducts.map((product, index) => (
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
            <button className="listproduct-edit-button" onClick={() => editProduct(product)}>Edit</button>
          </div>
        ))}
      </div>
      {editingProduct && (
        <div className="modal-background">
          <form onSubmit={updateProduct} className="edit-product-form">
            <h2>Edit Product</h2>
            <label>
              Name:
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </label>
            <label>
              Old Price:
              <input
                type="number"
                value={formData.old_price}
                onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
              />
            </label>
            <label>
              New Price:
              <input
                type="number"
                value={formData.new_price}
                onChange={(e) => setFormData({ ...formData, new_price: e.target.value })}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </label>
            <label>
              Category:
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                name="category"
                className="edit-product-selector"
              >
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kid">Kid</option>
              </select>
            </label>
            <label>
              Image URL:
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </label>
            <button type="submit">Update</button>
            <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ListProduct;
