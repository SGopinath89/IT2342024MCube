import React, { useState, useEffect } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';

const NewCollections = () => {
  const [newCollections, setNewCollections] = useState([]);

  useEffect(() => {
    const fetchNewCollections = async () => {
      try {
        const response = await fetch('http://localhost:4000/product/newcollections');
        if (!response.ok) {
          throw new Error('Failed to fetch new collections');
        }
        const data = await response.json();
        setNewCollections(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNewCollections();
  }, []);

  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className='collections'>
        {newCollections.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default NewCollections;
