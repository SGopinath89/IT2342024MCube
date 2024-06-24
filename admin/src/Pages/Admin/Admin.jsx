import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Routes,Route } from 'react-router-dom'
import AddProducts from '../../Components/AddProducts/AddProducts'
import ListProduct from '../../Components/ListProduct/ListProduct'
import ListOrder from '../../Components/ListOrder/ListOrder'

const Admin = () => {
  return (
    <div className='admin'>
        <Sidebar/>
        <Routes>
          <Route path='/addproduct' element={<AddProducts/>} />
          <Route path='/listproduct' element={<ListProduct/>} />
          <Route path='/listorder' element={<ListOrder/>} />
        </Routes>
    </div>
  )
}

export default Admin