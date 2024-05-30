import React from 'react';
import { Link } from 'react-router-dom'; 
import './Item.css';

const Item = ({ id, image, name, new_price, old_price }) => {
  return (
    <div className='item'>
      <Link to={`/product/${id}`}><img src={image} alt={name} /></Link>
      <p>{name}</p>
      <div className='item-prices'>
        <div className='item-prices-new'>
          ${new_price}
        </div>
        <div className='item-prices-old'>
          ${old_price}
        </div>
      </div>
    </div>
  );
};

export default Item;
