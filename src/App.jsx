import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from "./components/Login"
import LandingPage from './components/LandingPage'
import RegisterUser from './components/RegisterUser'
import FaceImageUpload from './components/FaceImageUpload'
import FaceImageResult from './components/FaceImageResult'  
import Product from './components/Product'

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
      </Routes>
    </Router>
  )
}

export default App
