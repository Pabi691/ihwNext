import React, { useCallback, useState } from "react";
import { useGlobal } from "../global/GlobalContext";
import { themeBgColor } from "../styles/typography";

const DeliveryEstimate = () => {
  const [pinCode, setPinCode] = useState("");
  const [deliveryData, setDeliveryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {token} = useGlobal();

  const fetchDeliveryDetails = useCallback(async () => {
    // // console.log('pinCode', pinCode);
    if (!pinCode) {
      setError("Please enter a pincode");
      return;
    }

    setLoading(true);
    setError(null);
    setDeliveryData(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/search_pin_code/${pinCode}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
        }
      );

      // if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();

      // console.log("pincode", pinCode);
      // console.log("API Response:", data);

      if (data.status && data.result_data?.delivery_codes?.length > 0) {
        setDeliveryData(data.result_data.delivery_codes[0].postal_code);
      } else {
        throw new Error("No delivery information found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  },[token, pinCode]);

  return (
    <div className="my-4">
      <h2 className="text-lg font-bold mb-4">Check Delivery Availability</h2>

      {/* Input and Button */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
          placeholder="Enter Pincode"
          className="p-2 border rounded w-full"
        />
        <button
          onClick={fetchDeliveryDetails}
          className={`bg-gray-500 text-white px-4 py-2 rounded hover:${themeBgColor}`}
        >
          Check
        </button>
      </div>

      {/* Show Loading, Error, or Delivery Data */}
      {loading && <p>Loading delivery details...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {deliveryData && (
        <div className="mt-4">
          {/* <h3 className="text-lg font-bold">Delivery Information</h3>
          <p><strong>City:</strong> {deliveryData.city}</p>
          <p><strong>District:</strong> {deliveryData.district}</p>
          <p><strong>Pincode:</strong> {deliveryData.pin}</p>
          <p><strong>State:</strong> {deliveryData.state_code}</p> */}
          <p className="text-green-500 font-medium">
            Estimated Delivery Time :
            {deliveryData.sun_tat ? " 1-3 Days (Express)" : " 3-5 Days (Standard)"}
          </p>
          <p className="font-medium text-gray-400">{deliveryData.cod === "Y" ? "Cash on Delivery is available" : "Cash on Delivery is not available"}</p>
          {/* <p><strong>Prepaid Available:</strong> {deliveryData.pre_paid === "Y" ? "Yes" : "No"}</p> */}
        </div>
      )}
    </div>
  );
};

export default DeliveryEstimate;

