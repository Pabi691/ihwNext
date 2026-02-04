import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "@/components/compat/router";
import { toast, ToastContainer } from "react-toastify";
import { useGlobal } from "../../global/GlobalContext";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const {token} = useGlobal();

  // Extract query params from URL
  const queryParams = new URLSearchParams(location.search);
  const tokenvarify = queryParams.get("token");
  const email = queryParams.get("email");

  const handleVerify = useCallback( async () => {
    // console.log('tokenvarify', tokenvarify);
    // console.log('email', email);
    // console.log('token', token);
    if (!tokenvarify || !email) {
      setMessage("Invalid verification link.");
      return;
    }

    setVerifying(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/verify_email_verification`,
        {   token: tokenvarify,
            email: email, },
        {
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
           },
        }
      );

      if (response.data.status) {
        setMessage("✅ Email verified successfully!");
        toast.success("Email verified successfully!", { position: "top-center" });
        localStorage.removeItem('uservarified');
        // Redirect to login or dashboard after a delay
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage("❌ Verification failed: " + (response.data.message || ""));
        toast.error(response.data.message || "Verification failed", { position: "top-center" });
      }
    } catch (error) {
      console.error("Verification Error:", error);
      setMessage("❌ Error: " + (error.response?.data?.message || "Something went wrong"));
      toast.error(error.response?.data?.message || "Something went wrong", { position: "top-center" });
    } finally {
      setVerifying(false);
    }
  }, [tokenvarify, email, navigate, token]);

  useEffect(() => {
    handleVerify();
  }, [handleVerify]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Verifying Your Email...</h1>
        {verifying ? (
          <p className="text-blue-500 font-medium">Please wait while we verify your email...</p>
        ) : (
          <p className="text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;


