import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Container, Box, Alert, CircularProgress } from '@mui/material';
import MainLayOut from '../../layout/MainLayOut';
// import API_BASE_URL from '../../global/apiConfig';
import { useGlobal } from '../../global/GlobalContext';
import { Link, useLocation, useNavigate } from '@/components/compat/router';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
// import GoogleLoginButton from './GoogleLoginButton';
import axios from 'axios';
import { toast } from 'react-toastify';
import { themeBgColor, themeTextColor } from '../../styles/typography';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordChange, setIsPasswordChange] = useState(false);
  const [otpSend, setOtpSend] = useState(false);
  // const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  // const [otpLoading, setOtpLoading] = useState(false);
  const { setToken } = useAuth();
  const [varify, setVarify] = useState(false);
  const { mergeLocalCartWithServer } = useGlobal();
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = '/myaccount';
  // console.log('location', location);
  // console.log('redirectTo', redirectTo);
  useEffect(() => {
    const uservarified = localStorage.getItem('uservarified');
    if (uservarified && uservarified === 'null') return;
    if (localStorage.getItem('userToken') && localStorage.getItem('uservarified')) {
      navigate(redirectTo, { state: location.state });
    }
  }, [redirectTo, location.state, navigate]);

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/webuser/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();
      if (!data.status) {
        setError(data.message || data.error_message || 'Login failed');
        return;
      }
      // console.log('data', data);
      if (data.user_data.email && (data.user_data.email_verified_at === null)) {
        setToken(data.user_token);
        setVarify(true);
        return;
      }

      if (data.status) {
        // console.log('data', data);
        if (
          data.user_data.email_verified_at !== null &&
          (!localStorage.getItem('uservarified') || localStorage.getItem('uservarified') === "null")
        ) {
          localStorage.setItem('uservarified', data.user_data.email_verified_at);
        }

        // return;
        setToken(data.user_token);
        localStorage.setItem('username', data.user_data.name);
        localStorage.setItem('useremail', data.user_data.email);
        await mergeLocalCartWithServer(data.user_token);

        navigate(redirectTo, { state: location.state });
        window.location.reload();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred while logging in.');
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/forgot-password`, {
        "email": email
      });

      const data = response.data;
      // console.log('response', response);
      console.log('forgot-password', data);
      if (data.status) {
        // console.log('response', response);
        setOtpSend(true);
      } else {
        setError(data.response || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred while sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  const resendHandler = async () => {
    setLoading(true);
    setSuccess(null);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/resend_email_verification`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('userToken')}`
        },
      });

      // console.log("API Response:", response.data);
      // return;
      if (response.data.status) {
        setSuccess("Email sent successfully");
      } else {
        toast.error(response.data.message, { position: "top-center" });
      }
    }
    catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <MainLayOut>
      <Box
        display="flex"
        bgcolor="#e6e7e8"
        padding={{
          xs: 2,
        }}
      >
        {varify ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md text-sm my-10 mx-auto w-1/2">
            <p className="mb-2">
              📧 A verification email has been sent to your email address. Please check your inbox and click the verification link.
            </p>
            <p>
              Didn’t receive the email?{" "}

              {loading ? 'Please Wait......' : success ? (
                <div className='text-green-600 text-sm'>
                  A varification link send to your email.
                </div>
              ) : (
                <button
                  onClick={resendHandler}
                  className={`${themeTextColor} underline hover:text-blue-800 font-medium`}
                >
                  {loading ? 'Please Wait......' : 'Resend Verification Link'}
                </button>
              )}
            </p>
          </div>

        ) : (
          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            p={4}
          >
            <Container sx={{ background: '#fff', padding: '25px 10px' }} maxWidth="xs">
              <Box mb={3}>
                <p className='font-bold text-sm text-gray-600 text-center'>
                  Login with Indian Hair World
                </p>

                {/* <div className='flex items-center justify-center gap-4 my-4'>
                <GoogleLoginButton />
              </div> */}

                <hr />
                <div className='flex justify-between items-center'>
                  <Link to={'../login'} className='px-2 py-1 bg-green-600 block w-fit m-auto text-white font-medium border uppercase mt-3'>
                    Login
                  </Link>
                  <Link to={`../register`} className='px-2 py-1 bg-gray-200 block w-fit m-auto text-black font-medium border uppercase mt-3'>
                    SignUp
                  </Link>
                </div>
              </Box>

              {error && <Alert severity="error">{error}</Alert>}
              {isPasswordChange ? (
                <>
                  <form onSubmit={sendOtp} className='border bg-[#e6e7e8] sign_in_form p-4'>
                    <input name='user_email' value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 my-3 border border-gray-300 rounded-md mt-2 focus:outline-none"
                      placeholder="Enter your registered email" />
                    {otpSend && (
                      <p className='text-xs my-2'>A link send to your email to change password.</p>
                    )}

                    <button
                      className={`py-2 px-3 rounded-md ${loading ? 'bg-gray-400' : themeBgColor} text-white font-medium m-auto block`}
                      type="submit"
                      disabled={loading}
                    >
                      {otpSend ? 'OTP send successfully' : `${loading ? 'Sending...' : "Send reset link"}`}
                    </button>
                  </form>
                  <div className="flex justify-between">
                    <button onClick={() => setIsPasswordChange(false)} className={`${themeTextColor} text-sm`} >
                      Back to login
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <form onSubmit={loginUser} className='border bg-[#e6e7e8] sign_in_form p-4'>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-semibold">Email / Phone number</label>
                      <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md mt-2 focus:outline-none"
                        placeholder="Enter your email / Phone Number"
                      />
                    </div>
                    <div className="mb-4 relative">
                      <label htmlFor="password" className="block text-sm font-semibold">Password</label>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}  // Toggle between text and password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md mt-2 pr-10 focus:outline-none"  // Added pr-10 for space for the icon
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute bottom-0 right-3 transform -translate-y-1/2 text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}  // Toggle showPassword state
                      >
                        {showPassword ? (
                          <AiOutlineEye size={20} />
                        ) : (
                          <AiOutlineEyeInvisible className='text-gray-400' size={20} />
                        )}
                      </button>
                    </div>
                    <button
                      className={`py-2 px-3 rounded-md ${themeBgColor} text-white font-medium m-auto block`}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : "Proceed"}
                    </button>
                  </form>
                  <div className="flex justify-between">
                    <button onClick={() => setIsPasswordChange(true)} className={`${themeTextColor} text-sm`}>
                      Forgot your password?
                    </button>
                  </div>
                </>
              )}
            </Container>
          </Box>
        )}
      </Box>
    </MainLayOut>
  );
};

export default Login;


