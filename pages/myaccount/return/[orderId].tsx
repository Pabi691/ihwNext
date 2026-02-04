// @ts-nocheck
import React, { useCallback, useState } from "react";
import SimpleLayout from "@/layout/SimpleLayout";
import { MenuItem, Select, TextField } from "@mui/material";
import { BiUpload } from "react-icons/bi";
import { useParams } from "@/components/compat/router";
import axios from "axios";
import { useGlobal } from "@/global/GlobalContext";
import { useNavigate } from "@/components/compat/router";
import { themeBgColor } from "@/styles/typography";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const Return = () => {
  const { orderId } = useParams();
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [proof, setProof] = useState(null);
  const [message, setMessage] = useState("");
  const { token } = useGlobal();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const navigate = useNavigate();


  const returnReasons = [
    "Sizing or fit issues",
    "Damaged or defective item (needs video proof)",
    "Did not meet expectations",
    "Others (explain)",
  ];

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Validate inputs
    const isOther = reason === "Others (explain)";
    if (!orderId || !reason || (isOther && !otherReason.trim()) || !proof) {
      setMessage("⚠️ Please fill all fields and upload proof.");
      setLoading(false); // ✅ Stop loader if error
      return;
    }
    // console.log('token', token);

    try {
      const combinedReason = reason === "Others (explain)" ? `${reason}: ${otherReason}` : reason;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/order_return_by_customer`,
        {
          order_id: orderId,
          return_reason: combinedReason,
          return_video: proof
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("order_return_by_customer_response", response);

      if (response.data.status) {
        setMessage("✅ Return request submitted successfully!");
        setButtonDisable(true);
      } else {
        setMessage("⚠️ Failed to submit return request. Try again.");
      }
    } catch (error) {
      console.error("Error submitting return:", error);
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token, orderId, reason, otherReason, proof]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("⚠️ File size exceeds 20MB limit.");
      setFile(null);
      setProof(null); // Ensure proof is cleared
      return;
    }

    setFile(selectedFile);
    setProof(selectedFile); // ✅ Must be valid
    setError("");
  };


  return (
    <SimpleLayout title='Return'>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="px-4 py-2 mt-4 ml-4 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
      >
        ← Back
      </button>

      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Request a Return</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Order ID */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Order ID</label>
            <input
              type="text"
              value={orderId}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Reason for Return */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Reason for Return</label>
            <Select
              fullWidth
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              displayEmpty
              className="bg-white rounded-lg"
            >
              {returnReasons.map((item, index) => (
                <MenuItem key={index} value={item}>{item}</MenuItem>
              ))}
            </Select>
          </div>

          {/* Additional Reason */}
          {reason === "Others (explain)" && (
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Explain Your Reason</label>
              <TextField
                fullWidth
                variant="outlined"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Enter details here..."
              />
            </div>
          )}

          {/* Upload Proof */}
          <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-5 bg-gray-50 hover:bg-gray-100 transition-all">
            <label className="flex items-center space-x-3 cursor-pointer">
              <BiUpload className="text-2xl text-gray-500" />
              <span className="text-gray-600 font-medium">
                {file ? file.name : "Click to upload video (Max 20MB)"}
              </span>
              <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
            </label>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            // disabled={loading || !!message}
            disabled={loading || buttonDisable}
            className={`w-full py-3 text-center font-medium rounded-lg transition duration-200 
          ${loading || buttonDisable ? 'bg-gray-400 text-white cursor-not-allowed' : `${themeBgColor} text-white hover:bg-gray-900`}`}
          >
            {loading ? 'Submitting...' : 'Submit Return Request'}
          </button>

          {/* Message Feedback */}
          {message && (
            <div className={`text-center mt-4 font-medium ${message.includes("⚠️") || message.includes("❌") ? "text-red-600" : "text-green-600"
              }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </SimpleLayout>

  );
};

export default Return;


