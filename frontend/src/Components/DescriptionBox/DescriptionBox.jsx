import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews (122)</div>
        </div>
        <div className="descriptionbox-description">
            <p>Cotton is a natural fiber obtained from the cotton plant's seed boll. It's known for being soft, breathable,
                 and absorbent, making it ideal for casual and everyday wear.</p>
            <p>Cotton is a natural fiber obtained from the cotton plant's seed boll. It's known for being soft, breathable,
                and absorbent, making it ideal for casual and everyday wear.</p>
        </div>
    </div>
  )
}

export default DescriptionBox