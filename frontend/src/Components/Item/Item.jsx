import React from 'react';
import './Item.css';

const Item = ({ image, name, new_price, old_price }) => {
  return (
    <div className='item'>
      <img src={image} alt={name} />
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
