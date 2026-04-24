import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaPhone, FaCalendarAlt, FaVenusMars, FaCut } from "react-icons/fa";
import { Link } from "@/components/compat/router";
import MainLayOut from "../../layout/MainLayOut";
import { useAuth } from "./AuthContext";
import { useGlobal } from "../../global/GlobalContext";

const Field = ({ icon, label, error, children }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
      {label}
    </label>
    <div
      className={`flex items-center gap-2 border-2 rounded-xl bg-gray-50 px-3 transition-all duration-200
        ${error
          ? "border-red-400 bg-red-50"
          : "border-gray-200 focus-within:border-[#04A9FF] focus-within:bg-white focus-within:shadow-md focus-within:shadow-[#04A9FF]/10"
        }`}
    >
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      {children}
    </div>
    {error && <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">⚠ {error}</p>}
  </div>
);

const Register = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [username, setUsername] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [varify, setVarify] = useState(false);

  const { setToken } = useAuth();
  const { mergeLocalCartWithServer } = useGlobal();

  const validateForm = () => {
    let errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!name.trim()) errs.name = "Full name is required";
    else if (name.length < 3) errs.name = "Name must be at least 3 characters";

    if (!username.trim()) errs.username = "Email is required";
    else if (!emailRegex.test(username)) errs.username = "Enter a valid email address";

    if (!mobileNo.trim()) errs.mobileNo = "Mobile number is required";
    else if (!phoneRegex.test(mobileNo)) errs.mobileNo = "Enter a valid 10-digit mobile number";

    if (!password.trim()) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";

    if (!dob || new Date(dob) > new Date(new Date().setFullYear(new Date().getFullYear() - 10)))
      errs.dob = "You must be at least 10 years old";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const registerUser = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setSuccess(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/webuser/sign_up`,
        { username, password, name, gender, dob, mobile_number: mobileNo },
        { headers: { "Content-Type": "application/json" } }
      );

      const userData = response.data;

      if (!userData.status) {
        setErrors({ form: userData.message || "Registration failed." });
        return;
      }

      setToken(userData.user_token);
      localStorage.setItem("username", userData.user_data.name);
      localStorage.setItem("useremail", userData.user_data.email);
      localStorage.setItem("uservarified", userData.user_data.email_verified_at);
      await mergeLocalCartWithServer(userData.user_token);

      if (response.data.user_data.email && response.data.user_data.email_verified_at === null) {
        setVarify(true);
        return;
      }

      if (response.data.status && response.data.user_data.email_verified_at !== null) {
        setSuccess("Registration successful! You can now log in.");
      } else {
        setErrors({ form: response.data.message || "Registration failed." });
        toast.error(response.data.message, { position: "top-center" });
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      setErrors({ form: error.response?.data?.message || "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const resendHandler = async () => {
    setLoading(true);
    setSuccess(null);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/resend_email_verification`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      if (response.data.status) {
        setSuccess("Email sent successfully");
      } else {
        toast.error(response.data.message, { position: "top-center" });
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayOut>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-blue-100 px-4 py-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#04A9FF] to-[#0070cc] px-8 pt-8 pb-10 text-center relative">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-3 shadow-lg">
                <FaCut className="text-white text-2xl rotate-45" />
              </div>
              <h1 className="text-white text-2xl font-extrabold tracking-tight leading-tight">
                Indian Hair World
              </h1>
              <p className="text-blue-100 text-sm mt-1 font-medium">Create your account to get started</p>
              {/* Decorative wave */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-white"
                style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0", transform: "scaleX(1.1)" }} />
            </div>

            {/* Form Body */}
            <div className="px-8 pt-6 pb-8">
              {errors.form && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
                  <span>⚠</span> {errors.form}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
                  <span>✓</span> {success}
                </div>
              )}

              {varify ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📧</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">Verify Your Email</h3>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                    A verification link has been sent to your email. Please check your inbox and click the link to continue.
                  </p>
                  {loading ? (
                    <p className="text-gray-400 text-sm">Sending...</p>
                  ) : success ? (
                    <p className="text-green-600 text-sm font-medium">{success}</p>
                  ) : (
                    <button
                      onClick={resendHandler}
                      className="text-[#04A9FF] text-sm font-semibold hover:underline transition"
                    >
                      Resend Verification Link
                    </button>
                  )}
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); registerUser(); }}>

                  {/* Full Name */}
                  <Field icon={<FaUser size={14} />} label="Full Name" error={errors.name}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="flex-1 py-3 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                    />
                  </Field>

                  {/* Gender + DOB side by side */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                        Gender
                      </label>
                      <div className={`flex items-center gap-2 border-2 rounded-xl bg-gray-50 px-3 transition-all duration-200
                        border-gray-200 focus-within:border-[#04A9FF] focus-within:bg-white focus-within:shadow-md focus-within:shadow-[#04A9FF]/10`}>
                        <FaVenusMars size={14} className="text-gray-400 flex-shrink-0" />
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="flex-1 py-3 bg-transparent text-sm text-gray-700 outline-none appearance-none cursor-pointer"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                        Date of Birth
                      </label>
                      <div className={`flex items-center gap-2 border-2 rounded-xl px-3 transition-all duration-200
                        ${errors.dob ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus-within:border-[#04A9FF] focus-within:bg-white focus-within:shadow-md focus-within:shadow-[#04A9FF]/10"}`}>
                        <FaCalendarAlt size={13} className="text-gray-400 flex-shrink-0" />
                        <input
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="flex-1 py-3 bg-transparent text-sm text-gray-700 outline-none"
                        />
                      </div>
                      {errors.dob && <p className="text-red-500 text-xs mt-1">⚠ {errors.dob}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <Field icon={<FaEnvelope size={14} />} label="Email Address" error={errors.username}>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 py-3 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                    />
                  </Field>

                  {/* Mobile Number */}
                  <Field icon={<FaPhone size={14} />} label="Mobile Number" error={errors.mobileNo}>
                    <span className="text-gray-400 text-sm font-medium pr-1 border-r border-gray-300 mr-1">+91</span>
                    <input
                      type="tel"
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="flex-1 py-3 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                    />
                  </Field>

                  {/* Password */}
                  <Field icon={<FaLock size={14} />} label="Password" error={errors.password}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="flex-1 py-3 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-[#04A9FF] transition-colors flex-shrink-0"
                    >
                      {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                    </button>
                  </Field>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 rounded-xl font-bold text-white text-sm tracking-wide
                      bg-gradient-to-r from-[#04A9FF] to-[#0070cc]
                      hover:from-[#0070cc] hover:to-[#004fa3]
                      active:scale-[0.98] transition-all duration-200
                      shadow-lg shadow-[#04A9FF]/30
                      disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>
              )}

              {/* Footer link */}
              {!varify && (
                <p className="text-center text-sm text-gray-500 mt-6">
                  Already have an account?{" "}
                  <Link to="../login" className="text-[#04A9FF] font-semibold hover:underline transition">
                    Log in
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayOut>
  );
};

export default Register;
