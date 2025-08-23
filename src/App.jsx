import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from "./components/Login"
import LandingPage from './components/LandingPage'
import RegisterUser from './components/RegisterUser'
import FaceImageUpload from './components/FaceImageUpload'
import FaceImageResult from './components/FaceImageResult'  
import Product from './components/Product'
import ProductManage from './components/ProductManage'
import AddProduct from './components/AddProduct'
import EditProduct from './components/EditProduct'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/face-upload" element={<FaceImageUpload />} />
        <Route path="/face-result" element={<FaceImageResult />} />
        <Route path="/products" element={<Product />} />
        <Route path="/product-manage" element={<ProductManage />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/update-product/:id" element={<EditProduct />} />
      </Routes>
    </Router>
  )
}

export default App
