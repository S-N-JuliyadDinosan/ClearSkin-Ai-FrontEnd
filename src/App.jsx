import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Public pages
import Login from "./components/Login"
import LandingPage from './components/LandingPage'
import RegisterUser from './components/RegisterUser'
import HowToDo from './components/HowToDo'
import Doctors from './components/Doctors'
import OurDoctors from './components/OurDoctors'

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
import UserProfile from './components/UserProfile'
import AnalysisViewUser from './components/AnalysisViewUser'

// Admin features
import AdminDashboard from './components/AdminDashboard'
import ViewAllUsers from './components/ViewAllUsers'
import AdminUserRegister from './components/AdminUserRegister'
import Product from './components/Product'
import ProductManage from './components/ProductManage'
import AddProduct from './components/AddProduct'
import EditProduct from './components/EditProduct'
import AdminManageAppointments from './components/AdminManageAppointments'
import BookAppointmentByAdmin from './components/BookAppointmentByAdmin'
import AdminAnalysisHistory from './components/AdminAnalysisHistory'
import ManageDoctors from './components/ManageDoctors'
import AddDoctor from './components/AddDoctor'
import EditDoctor from './components/EditDoctor'

// Utilities
import ProtectedRoute from './components/ProtectedRoute'

// Dashboard home page (inside admin layout)
const DashboardHome = () => (
  <div className="p-6">
    {/* Admin Overview Placeholder */}
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
        <Route path="/how-to-do" element={<HowToDo />} />
        <Route path="/doctors" element={<Doctors />} />

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
          <Route path="analysis-view/user" element={<AnalysisViewUser />} /> 

          <Route path="book-appointment/user" element={<BookAppointmentByUser />} />
          <Route path="update-appointment/user/:appointmentId" element={<EditAppointmentByUser />} />
          <Route path="user-appointments" element={<UserAppointments />} />
          <Route path="our-doctors" element={<OurDoctors />} />
          <Route path="user-profile" element={<UserProfile />} />
        </Route>

        {/* ADMIN DASHBOARD */}
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />

          <Route path="users">
            <Route index element={<ViewAllUsers />} />
            <Route path="user-register" element={<AdminUserRegister />} />
          </Route>  

          <Route path="analysis-history">
            <Route index element={<AdminAnalysisHistory />} />
            <Route path="analysis-view/user" element={<AnalysisView />} />
          </Route>

          <Route path="appointments">
            <Route index element={<AdminManageAppointments />} />
            <Route path="create-appointment" element={<BookAppointmentByAdmin />} />
          </Route>

          <Route path="manage-doctors">
            <Route index element={<ManageDoctors />} />
            <Route path="add" element={<AddDoctor />} /> 
            <Route path="edit/:doctorId" element={<EditDoctor />} /> 
          </Route>

          <Route path="products">
            <Route index element={<ProductManage />} />
            <Route path="add" element={<AddProduct />} />
            <Route path="edit/:id" element={<EditProduct />} />
          </Route>
        </Route>
      </Routes>

      {/* ToastContainer at App root */}
      <ToastContainer 
        position="top-right"
        theme="colored"
        autoClose={2000}
        pauseOnHover={false}
        newestOnTop
      />
    </Router>
  )
}

export default App
