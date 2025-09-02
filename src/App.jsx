import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Public pages
import Login from "./components/Login"
import LandingPage from './components/LandingPage'
import RegisterUser from './components/RegisterUser'

// User features
import FaceImageUpload from './components/FaceImageUpload'
import FaceImageResult from './components/FaceImageResult'
import UserDashboard from './components/UserDashboard'
import BookAppointmentByUser from './components/BookAppointmentByUser'
import UserAppointments from './components/UserAppointments'
import EditAppointmentByUser from './components/EditAppointmentByUser'
import AnalysisHistory from './components/AnalysisHistory'
import AnalysisView from './components/AnalysisView'
import UserDashboardOverview from './components/UserDashboardOverview'

// Admin features
import AdminDashboard from './components/AdminDashboard'
import ViewAllUsers from './components/ViewAllUsers'
import AdminUserRegister from './components/AdminUserRegister'
import Product from './components/Product'
import ProductManage from './components/ProductManage'
import AddProduct from './components/AddProduct'
import EditProduct from './components/EditProduct'

// Utilities
import ProtectedRoute from './components/ProtectedRoute'

// Dashboard home page (inside admin layout)
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

        {/* Protected Routes */}
        <Route path="/face-upload" element={
          <ProtectedRoute>
            <FaceImageUpload />
          </ProtectedRoute>
        } />
        <Route path="/face-result" element={
          <ProtectedRoute>
            <FaceImageResult />
          </ProtectedRoute>
        } />

        <Route path="/products" element={<Product />} />

        {/* Standalone product management */}
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/update-product/:id" element={<EditProduct />} />

        {/* USER DASHBOARD */}
        <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}>
          <Route index element={<UserDashboardOverview />} />

          <Route path="analysis-history/user" element={<AnalysisHistory />} />
          <Route path="analysis-view/user" element={<AnalysisView />} /> 

          <Route path="book-appointment/user" element={<BookAppointmentByUser />} />
          <Route path="update-appointment/user/:appointmentId" element={<EditAppointmentByUser />} />
          <Route path="user-appointments" element={<UserAppointments />} />
        </Route>

        {/* ADMIN DASHBOARD */}
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />

          <Route path="users">
            <Route index element={<ViewAllUsers />} />
            <Route path="user-register" element={<AdminUserRegister />} />
          </Route>  

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
