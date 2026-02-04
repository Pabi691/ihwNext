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
  const { setToken, userToken } = useAuth();
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
    if (userToken && localStorage.getItem('uservarified')) {
      navigate(redirectTo, { state: location.state });
    }
  }, [redirectTo, location.state, navigate, userToken]);

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
        sx={{
          backgroundImage:
            "linear-gradient(135deg, rgba(8, 9, 12, 0.55), rgba(12, 16, 24, 0.35)), url('/images/toppers_streakers.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        minHeight="80vh"
        justifyContent="center"
        alignItems="center"
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
            <Container
              sx={{
                background: "linear-gradient(160deg, rgba(255,255,255,0.75), rgba(255,255,255,0.55))",
                padding: "28px 18px",
                borderRadius: "16px",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.35)",
                boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
              }}
              maxWidth="xs"
            >
              <Box mb={3} className="text-center">
                <p className="text-[11px] uppercase tracking-[0.35em] text-gray-600">
                  Indian Hair World
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  Welcome back
                </h2>
                <p className="mt-1 text-xs text-gray-600">
                  Sign in to continue your journey
                </p>

                {/* <div className='flex items-center justify-center gap-4 my-4'>
                <GoogleLoginButton />
              </div> */}

                <hr />
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    to={"../login"}
                    className="px-3 py-2 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wide text-center shadow-md hover:shadow-lg transition"
                  >
                    Login
                  </Link>
                  <Link
                    to={`../register`}
                    className="px-3 py-2 rounded-full bg-white/70 text-gray-900 text-xs font-semibold uppercase tracking-wide text-center border border-gray-200 hover:bg-white transition"
                  >
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
                  <form onSubmit={loginUser} className="sign_in_form p-4">
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Email or phone
                      </label>
                      <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 mt-2 rounded-xl border border-white/60 bg-white/80 text-sm text-gray-900 shadow-sm outline-none transition focus:border-black/60 focus:ring-2 focus:ring-black/10"
                        placeholder="Enter your email / Phone Number"
                      />
                    </div>
                    <div className="mb-4 relative">
                      <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Password
                      </label>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}  // Toggle between text and password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 mt-2 rounded-xl border border-white/60 bg-white/80 text-sm text-gray-900 shadow-sm outline-none transition focus:border-black/60 focus:ring-2 focus:ring-black/10 pr-10"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute bottom-0 right-3 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition"
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
                      className={`w-full py-3 rounded-full ${themeBgColor} text-white font-semibold tracking-wide shadow-md hover:shadow-lg transition`}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : "Proceed"}
                    </button>
                  </form>
                  <div className="flex justify-center mt-2">
                    <button onClick={() => setIsPasswordChange(true)} className={`text-black text-sm underline decoration-1 underline-offset-4`}>
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


