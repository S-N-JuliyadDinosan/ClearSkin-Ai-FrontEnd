import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); 


    const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8082/api/v1/user/login', {
        email,
        password,
      });

      console.log('Login successful:', response.data);
      setMessage(`Welcome, ${response.data.name || response.data.email}!`);

      toast.success(`Login successful!`, {
        position: 'top-right',
        autoClose: 3000, // 3 seconds
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
        navigate('/');
      }, 3000); // Delay by 3 seconds
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);

      toast.error('Login failed. Please check your credentials.', {
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
          'url(https://res.cloudinary.com/dkt1t22qc/image/upload/v1742348950/Prestataires_Documents/fopt5esl9cgvlcawz1z4.jpg)',
      }}
    >
      <div className="h-screen flex justify-center items-center backdrop-brightness-50">
        <div className="flex flex-col items-center space-y-8">
          <div></div>
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
              <span className="text-[#228CE0] cursor-pointer"> Sign up</span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
