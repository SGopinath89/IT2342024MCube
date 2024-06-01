import React, { useState } from 'react';
import './AddProducts.css';
import upload_area from '../../assets/upload_area.svg';

const AddProducts = () => {
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women",
        new_price: "",
        old_price: ""
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const Add_Product = async () => {
        console.log("Adding product:", productDetails);
        let responseData;
        let product = { ...productDetails };

        let formData = new FormData();
        formData.append('product', image);

        try {
            const uploadResponse = await fetch('http://localhost:4000/upload', {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error(`Upload failed with status: ${uploadResponse.status}`);
            }

            responseData = await uploadResponse.json();

            if (responseData.success) {
                product.image = responseData.image_url;
                console.log("Product after image upload:", product);

                const addProductResponse = await fetch('http://localhost:4000/addproduct', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
                });

                if (!addProductResponse.ok) {
                    throw new Error(`Add product failed with status: ${addProductResponse.status}`);
                }

                const addProductData = await addProductResponse.json();

                addProductData.success ? alert("Product Added") : alert("Failed");
            } else {
                alert("Image upload failed");
            }
        } catch (error) {
            console.error("Error adding product:", error);
            alert("An error occurred while adding the product");
        }
    };

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product Title</p>
                <input
                    value={productDetails.name}
                    onChange={changeHandler}
                    type="text"
                    name="name"
                    placeholder='Enter Product Title'
                />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input
                        value={productDetails.old_price}
                        onChange={changeHandler}
                        type="text"
                        name="old_price"
                        placeholder='Type here'
                    />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input
                        value={productDetails.new_price}
                        onChange={changeHandler}
                        type="text"
                        name="new_price"
                        placeholder='Type here'
                    />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select
                    value={productDetails.category}
                    onChange={changeHandler}
                    name="category"
                    className="add-product-selector"
                >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img
                        src={image ? URL.createObjectURL(image) : upload_area}
                        className='addproduct-thumnail-img'
                        alt="Upload Thumbnail"
                    />
                </label>
                <input
                    onChange={imageHandler}
                    type="file"
                    name="image"
                    id="file-input"
                    hidden
                />
            </div>
            <button onClick={Add_Product} className='addproduct-btn'>Add Product</button>
        </div>
    );
};

export default AddProducts;
