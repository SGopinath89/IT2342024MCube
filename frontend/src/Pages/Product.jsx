import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import Breadcrum from '../Components/Breadcrums/Breadcrum'; // Import Breadcrum component
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import Relatedproducts from '../Components/RelatedProducts/Relatedproducts';

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const product = all_product.find((e) => e.id === Number(productId));
  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} /> 
      <DescriptionBox/>
      <Relatedproducts/>
    </div>
  );
};

export default Product;
