import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useRedirectWithLoader } from './useRedirectWithLoader';
import Loader from './Loader';
import jwt_decode from 'jwt-decode';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { loading: redirectLoading, redirect } = useRedirectWithLoader();

    const handleLogin = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/v1/user/login', {
          email,
          password,
        });

        const token = response.data.token;
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userEmail', response.data.email);

        const decoded = jwt_decode(token);
        const role = decoded.role || 'USER';

        // ✅ check if redirect path exists
        const redirectPath = localStorage.getItem("redirectPath");

        toast.success('Login successful!', {
          position: 'top-right',
          autoClose: 2000,
          theme: 'colored',
        });

        setTimeout(() => {
          if (redirectPath) {
            localStorage.removeItem("redirectPath");
            redirect(redirectPath, 2000, () => navigate(redirectPath));
          } else {
            if (role === 'ADMIN') {
              redirect('/admin-dashboard', 2000, () => navigate('/admin-dashboard'));
            } else {
              redirect('/user-dashboard', 2000, () => navigate('/user-dashboard'));
            }
          }
        }, 1000);

      } catch (err) {
        console.error('Login error:', err);
        toast.error('Login failed. Please check your credentials.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
      }
    };

  const handleSignUpRedirect = () => {
    redirect('/register', 2000, () => navigate('/register'));
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          'url(https://res.cloudinary.com/dkt1t22qc/image/upload/v1742348950/Prestataires_Documents/fopt5esl9cgvlcawz1z4.jpg)',
      }}
    >
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center cursor-pointer">
            <div
              className="flex items-center space-x-4"
              onClick={() => redirect('/', 1000, () => navigate('/'))}
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

      {/* Login Form */}
      <div className="flex-1 flex justify-center items-center backdrop-brightness-50">
        {redirectLoading && <Loader />}
        <div
          className={`flex flex-col items-center space-y-8 ${
            redirectLoading ? 'opacity-30 pointer-events-none' : ''
          }`}
        >
          <div
            className="rounded-[20px] w-80 p-8 bg-[#310D84]"
            style={{ boxShadow: '-6px 3px 20px 4px #0000007d' }}
          >
            <h1 className="text-white text-3xl font-bold mb-4">Login</h1>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#8777BA] w-full p-2.5 rounded-md placeholder:text-gray-300 shadow-md shadow-blue-950"
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#8777BA] w-full p-2.5 rounded-md placeholder:text-gray-300 shadow-md shadow-blue-950 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <span className="text-[#228CE0] text-[10px] ml-2 cursor-pointer">
                Forget Password?
              </span>
            </div>
            <div className="flex justify-center mb-4">
              <button
                onClick={handleLogin}
                className="h-10 w-full cursor-pointer text-white rounded-md bg-gradient-to-br from-[#7336FF] to-[#3269FF] shadow-md shadow-blue-950"
              >
                Sign In
              </button>
            </div>
            {message && (
              <div className="text-sm text-center text-white mt-2">{message}</div>
            )}
            <div className="text-gray-300 text-center">
              Don&#x27;t have an account?
              <span
                className="text-[#228CE0] cursor-pointer ml-1"
                onClick={handleSignUpRedirect}
              >
                Sign up
              </span>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;
