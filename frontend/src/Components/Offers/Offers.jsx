import React from 'react'
import './Offers.css'
import exclusive_image from '../Assets/exclusive_image.png'

const Offers = () => {
  return (
    <div className='offers'>
        <div className='offers-left'>
            <h1>Special Deals</h1>
            <h1>Just for You</h1>
            <p>ONLY ON BEST SELLERS PRODUCTS</p>
            <button>Check Now</button>
        </div>
        <div className='offers-right'>
        <img src={exclusive_image} alt="Exclusive Offers" />
        </div>
    </div>
  )
}

export default Offers