import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useRedirectWithLoader } from './useRedirectWithLoader';
import Loader from './Loader';

function RegisterUser() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [bgLoaded, setBgLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const navigate = useNavigate();
  const { loading: redirectLoading, redirect } = useRedirectWithLoader();

  // Preload background image
  useEffect(() => {
    const img = new Image();
    img.src =
      'https://res.cloudinary.com/dkt1t22qc/image/upload/v1742357451/Prestataires_Documents/cynbxx4vxvgv2wrpakiq.jpg';
    img.onload = () => setBgLoaded(true);
  }, []);

  const validateFields = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Field is empty';
    if (!email) newErrors.email = 'Field is empty';
    if (!password) newErrors.password = 'Field is empty';
    if (!retypePassword) newErrors.retypePassword = 'Field is empty';
    if (password && retypePassword && password !== retypePassword) {
      newErrors.retypePassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    try {
      const response = await axios.post('http://localhost:8000/api/v1/user/register', {
        email,
        name,
        password,
        retypePassword,
      });

      toast.success('Registration successful!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });

      redirect('/login', 1000, () =>
        navigate('/login', { state: { user: response.data } })
      );
    } catch {
      toast.error('Registration failed. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    }
  };

  const handleLoginRedirect = () => {
    redirect('/login', 1000, () => navigate('/login'));
  };

  if (!bgLoaded) {
    return (
      <div className="h-screen w-screen flex justify-center items-center bg-gray-800 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dkt1t22qc/image/upload/v1742357451/Prestataires_Documents/cynbxx4vxvgv2wrpakiq.jpg')`,
      }}
    >
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => redirect('/', 500, () => navigate('/'))}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10
                     10-4.477 10-10S17.523 2 12 2zM12 7a1 1 0 100 2
                     1 1 0 000-2zm0 4c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z"
                />
                <circle cx="18" cy="6" r="1" fill="currentColor" />
              </svg>
              <span className="text-2xl font-bold text-white">ClearSkinAI</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Register Form */}
      <div className="flex-1 flex justify-center items-center backdrop-brightness-50">
        {redirectLoading && <Loader />}
        <div className={`flex flex-col items-center space-y-8 ${redirectLoading ? 'opacity-30 pointer-events-none' : ''}`}>
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
                className={`bg-[#8777BA] w-full p-2.5 rounded-md placeholder:text-gray-300 shadow-md shadow-blue-950 ${
                  errors.name ? 'border-2 border-red-500' : ''
                }`}
              />
              {errors.name && <div className="text-red-400 text-xs">{errors.name}</div>}

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`bg-[#8777BA] w-full p-2.5 rounded-md placeholder:text-gray-300 shadow-md shadow-blue-950 ${
                  errors.email ? 'border-2 border-red-500' : ''
                }`}
              />
              {errors.email && <div className="text-red-400 text-xs">{errors.email}</div>}

              {/* Password with toggle */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`bg-[#8777BA] w-full p-2.5 rounded-md placeholder:text-gray-300 shadow-md shadow-blue-950 pr-10 ${
                    errors.password ? 'border-2 border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <div className="text-red-400 text-xs">{errors.password}</div>}

              {/* Retype Password with toggle */}
              <div className="relative">
                <input
                  type={showRetypePassword ? 'text' : 'password'}
                  placeholder="Retype Password"
                  value={retypePassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                  className={`bg-[#8777BA] w-full p-2.5 rounded-md placeholder:text-gray-300 shadow-md shadow-blue-950 pr-10 ${
                    errors.retypePassword ? 'border-2 border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowRetypePassword(!showRetypePassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300"
                >
                  {showRetypePassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.retypePassword && <div className="text-red-400 text-xs">{errors.retypePassword}</div>}
            </div>

            <div className="flex justify-center mb-4 mt-6">
              <button
                onClick={handleRegister}
                className="h-10 w-full cursor-pointer text-white rounded-md bg-gradient-to-br from-[#7336FF] to-[#3269FF] shadow-md shadow-blue-950"
              >
                Create Account
              </button>
            </div>

            <div className="text-gray-300 text-center">
              Already have an account?
              <span
                className="text-[#228CE0] cursor-pointer ml-1"
                onClick={handleLoginRedirect}
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
