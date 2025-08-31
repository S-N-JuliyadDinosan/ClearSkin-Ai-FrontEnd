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
import UserDashboard from './components/UserDashboard'
import AdminDashboard from './components/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import BookAppointmentByUser from './components/BookAppointmentByUser'
import UserAppointments from './components/UserAppointments'
import EditAppointmentByUser from './components/EditAppointmentByUser'
import ViewAllUsers from './components/ViewAllUsers'
import AdminUserRegister from './components/AdminUserRegister'

// dashboard home page (inside admin layout)
const DashboardHome = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold">Admin Overview</h2>
    <p className="mt-2 text-gray-600">Charts, stats and quick summary go here.</p>
  </div>
)

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />

        {/* ✅ Protected Route for Face Upload */}
        <Route
          path="/face-upload"
          element={
            <ProtectedRoute>
              <FaceImageUpload />
            </ProtectedRoute>
          }
        />

        <Route path="/face-result" element={<FaceImageResult />} />
        <Route path="/products" element={<Product />} />

        {/* Standalone product management routes */}
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/update-product/:id" element={<EditProduct />} />

        {/* ================= USER DASHBOARD ================= */}
        <Route path="/user-dashboard" element={<UserDashboard />}>
          <Route index element={<div className="p-6 text-xl">Welcome to your dashboard!</div>} />

          {/* Nested routes */}
          <Route path="book-appointment/user" element={<BookAppointmentByUser />} />

          {/* ✅ Updated route: include :appointmentId */}
          <Route path="update-appointment/user/:appointmentId" element={<EditAppointmentByUser />} />

          <Route path="user-appointments" element={<UserAppointments />} />
        </Route>

        {/* ================= ADMIN DASHBOARD ================= */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<DashboardHome />} />

          {/* <Route path="users" element={<ViewAllUsers />} /> */}
          

          <Route path="users">
            <Route index element={<ViewAllUsers />} />
            <Route path="user-register" element={<AdminUserRegister />} />
          </Route>  

          {/* Products management nested routes */}
          <Route path="products">
            <Route index element={<ProductManage />} />
            <Route path="add" element={<AddProduct />} />
            <Route path="edit/:id" element={<EditProduct />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
