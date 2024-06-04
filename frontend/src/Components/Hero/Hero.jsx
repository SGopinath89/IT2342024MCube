import React from 'react';
import './Hero.css';
import hand_icon from '../Assets/hand_icon.png';
import arrow from '../Assets/arrow.png';
import hero_image from '../Assets/hero_image.png';
import hero_image1 from '../Assets/hero_image1.png';
import hero_image2 from '../Assets/hero_image2.png';

const Hero = () => {
  return (
    <div className='hero'>
      <div className='hero-left'>
        <h2>NEW ARRIVALS ONLY</h2>
        <div>
          <div className='hero-hand-icon'>
            <p>new</p>
            <img src={hand_icon} alt="" />
          </div>
          <p>collections</p>
          <p>for everyone</p>
        </div>
        <div className='hero-latest-btn'>
          <div>Latest Collections</div>
          <img src={arrow} alt="" />
        </div>
      </div>
      <div className='hero-right'>
        <img src={hero_image} className='hero-right-1' alt="" />
        <img src={hero_image1} className='hero-right-2' alt="" />
        <img src={hero_image2} className='hero-right-3' alt="" />
      </div>
    </div>
  );
};

export default Hero