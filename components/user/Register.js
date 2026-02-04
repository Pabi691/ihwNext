import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Add icons for password visibility toggle
import { Link } from "@/components/compat/router";
import MainLayOut from "../../layout/MainLayOut";
import { useAuth } from "./AuthContext";
import { useGlobal } from "../../global/GlobalContext";
import { themeBgColor, themeTextColor } from "../../styles/typography";

const Register = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [varify, setVarify] = useState(false);
  // const navigate = useNavigate();
  // const location = useLocation();
  // const redirectTo = '/myaccount';
  const { setToken } = useAuth();
  const { mergeLocalCartWithServer } = useGlobal();


  // useEffect(() => {
  //   if (localStorage.getItem('userToken') && (uservarified && uservarified !== null)) {
  //     navigate(redirectTo, { state: location.state });
  //   }
  // }, [redirectTo])

  const validateForm = () => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!name.trim()) errors.name = "Name is required";
    else if (name.length < 3) errors.name = "Name must be at least 3 characters long";

    if (!username.trim()) errors.username = "Email or Phone Number is required";
    else if (!emailRegex.test(username) && !phoneRegex.test(username))
      errors.username = "Enter a valid Email or Phone Number";

    if (!password.trim()) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters long";

    if (!dob || new Date(dob) > new Date(new Date().setFullYear(new Date().getFullYear() - 10)))
      errors.dob = "You must be at least 10 years old";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const registerUser = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setSuccess(null);

    try {
      const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/webuser/sign_up`,
        { username, password, name, gender, dob },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("API Response:", response.data);
      const userData = response.data ;

      if (!userData.status) {
        setErrors({ form: userData.message || "Registration failed." });
        return;
      }

      if (userData.status) {
        setToken(userData.user_token);
        localStorage.setItem('username', userData.user_data.name);
        localStorage.setItem('useremail', userData.user_data.email);
        localStorage.setItem('uservarified', userData.user_data.email_verified_at);
        await mergeLocalCartWithServer(userData.user_token);
      } 

      if (response.data.user_data.email && (response.data.user_data.email_verified_at === null)) {
        setVarify(true);
        return;
      }

      if (response.data.status && (response.data.user_data.email_verified_at !== null)) {
        setSuccess("Registration successful! You can now log in.");
        // navigate('/login');
      } else {
        setErrors({ form: response.data.message || "Registration failed." });
        toast.error(response.data.message, { position: "top-center" });
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      setErrors({
        form: error.response?.data?.message || "Something went wrong. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };


  const resendHandler = async () => {
          setLoading(true);
          setSuccess(null);
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/resend_email_verification`, {
              headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('userToken')}` }, 
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
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <ToastContainer />
        <div className="bg-white p-6 border rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-center text-xl font-bold text-gray-700 mb-6">
            Register with Indian Hair World
          </h2>

          {errors.form && <div className="text-red-500 text-sm mb-4">{errors.form}</div>}
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
          {varify ? (
             <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md text-sm my-10 mx-auto w-1/2">
              <p className="mb-2">
                📧 A verification email has been sent to your email address. Please check your inbox and click the verification link.
              </p>
              <p>
                Didn’t receive the email?{" "}

                {loading? 'Please Wait......' : success?(
                    <div className='text-green-600 text-sm'>
                      A varification link send to your email.
                    </div>
                  ):(
                <button
                  onClick={resendHandler}
                  className="text-blue-600 underline hover:text-blue-800 font-medium"
                >              
                  {loading? 'Please Wait......' : 'Resend Verification Link'}               
                </button>
                  )}
              </p>
            </div>

          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                registerUser();
              }}
            >
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Enter your full name"
                />
                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                />
                {errors.dob && <div className="text-red-500 text-sm">{errors.dob}</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Enter your email"
                />
                {errors.username && <div className="text-red-500 text-sm">{errors.username}</div>}
              </div>

              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Enter your password"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute bottom-0 right-3 transform -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                </span>
                {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
              </div>

              <div className="mb-4">
                <button
                  type="submit"
                  className={`w-full py-2 ${themeBgColor} text-white font-bold rounded-md`}
                  disabled={loading}
                >
                  {loading ? <span>Loading...</span> : "Register"}
                </button>
              </div>
            </form>
          )}

          {!varify && (
          <div className="flex justify-between">
            <Link to="../login" className={`${themeTextColor} text-sm`}>
              Already have an account? Login
            </Link>
          </div>
)}
          
        </div>
      </div>

    </MainLayOut>
  );
};

export default Register;


