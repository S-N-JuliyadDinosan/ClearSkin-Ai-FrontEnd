import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

function RegisterUser() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8082/api/v1/user/register', {
        email,
        name,
      });

      console.log('Registration successful:', response.data);
      setMessage(`Welcome, ${response.data.name || response.data.email}!`);

      toast.success('Registration successful!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        className: 'custom-toast toast-success',
        bodyClassName: 'custom-toast-body',
      });

      // Delay navigation to allow toast to be visible
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);

      toast.error('Registration failed. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        className: 'custom-toast toast-error',
        bodyClassName: 'custom-toast-body',
      });
    }
  };

  return (
    <div
      className="bg-cover bg-gradient-to-br from-[#7337FF] via-[#000000] to-[#0C7EA8]"
      style={{
        backgroundImage:
          'url(https://res.cloudinary.com/dkt1t22qc/image/upload/v1742357451/Prestataires_Documents/cynbxx4vxvgv2wrpakiq.jpg)',
      }}
    >
      <div className="h-screen flex justify-center items-center backdrop-brightness-50">
        <div className="flex flex-col items-center space-y-8">
          <div></div>
          <div
            className="rounded-[20px] w-80 p-8 bg-[#310D84]"
            style={{ boxShadow: '-6px 3px 20px 4px #0000007d' }}
          >
            <h1 className="text-white text-3xl font-bold mb-4 text-center">Register</h1>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#8777BA] w-full p-2.5 rounded-md placeholder:text-gray-300 shadow-md shadow-blue-950"
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#8777BA] w-full p-2.5 rounded-md placeholder:text-gray-300 shadow-md shadow-blue-950"
              />
            </div>
            <div className="flex justify-center mb-4 mt-6">
              <button
                onClick={handleRegister}
                className="h-10 w-full cursor-pointer text-white rounded-md bg-gradient-to-br from-[#7336FF] to-[#3269FF] shadow-md shadow-blue-950"
              >
               Create User
              </button>
            </div>
            {message && (
              <div className="text-sm text-center text-white mt-2">{message}</div>
            )}
            <div className="text-gray-300 text-center">
              Already have an account?
              <span
                className="text-[#228CE0] cursor-pointer ml-1"
                onClick={() => navigate('/login')}
              >
                Login
              </span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default RegisterUser;
