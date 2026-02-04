import React, { useState, useEffect, useRef } from "react";
// import API_BASE_URL from "../../global/apiConfig";
import { useGlobal } from "../../global/GlobalContext";
import { Link, useLocation, useNavigate } from "@/components/compat/router";
import { TextField, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import axios from "axios";
import { themeBgColor } from "../../styles/typography";

const ShippingAddress = () => {
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const { token } = useGlobal();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [addressToCancel, setAddressToCancel] = useState(null);
  const isEditing = location.state?.address ? true : false;
  const isAdd = location.state?.status === 'add' ? true : false;
  // console.log('isEditing', isEditing);
  // console.log('isAdd', isAdd);
  const [newAddress, setNewAddress] = useState({
    address_label: "",
    full_name: "",
    email: "",
    mobile_number: "",
    alt_mob_number: "",
    address_line_1: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
  });
  const hasFetchedRef = useRef(false);
  const inFlightRef = useRef(false);

  useEffect(() => {  
    if (location.state?.address) {
      // console.log("Location State:", location.state);
      setNewAddress(location.state.address);
    }
  }, [location.state]);


  useEffect(() => {
    if (typeof window === "undefined") return;
    const userToken = localStorage.getItem("userToken");
    if (!userToken) return;
    if (hasFetchedRef.current || inFlightRef.current) return;

    const fetchShipping = async () => {
      inFlightRef.current = true;
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_customer_shipping_addresses`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        const data = response.data;
       if(data.status) {
        setShippingAddresses(data.shipping_addresses);
        // console.log('data.shipping_addresses', data);
       } 

      } catch (error) {
        console.error("Error fetching shipping:", error);
      } finally {
        inFlightRef.current = false;
        hasFetchedRef.current = true;
      }
    };
    fetchShipping();
  }, [token]);

  // Add New Shipping Address
  // const handleAddAddress = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/add_customer_shipping_addresses`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(newAddress),
  //     });
  //     // console.log('address', response);
  //     if (!response.ok) throw new Error("Failed to add shipping address");
  //     const data = await response.json();
  //     setShippingAddresses((prev) => [...prev, data.new_address]);
  //     setNewAddress({
  //       address_label: "",
  //       full_name: "",
  //       email: "",
  //       mobile_number: "",
  //       alt_mob_number: "",
  //       address_line_1: "",
  //       city: "",
  //       state: "",
  //       zip_code: "",
  //       country: "",
  //     });
  //     const status = location.state?.status || "myaccount/addresses";
  //     if (status){
  //       navigate(`/${status}`);
  //     }
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Error adding address:", error);
  //   }
  // };


  // ✅ **Add or Update Address**
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log('newAddress.id', newAddress.id);
    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/update_customer_shipping_addresses?address_id=${newAddress.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/add_customer_shipping_addresses`;

      // const method = isEditing ? "PUT" : "POST";
      const method = "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAddress),
      });
      // console.log('update', response);

      if (!response.ok) throw new Error(isEditing ? "Failed to update address" : "Failed to add address");

      const data = await response.json();

      if (isEditing) {
        setShippingAddresses((prev) =>
          prev.map((addr) => (addr.id === newAddress.id ? data.updated_address : addr))
        );
      } else {
        setShippingAddresses((prev) => [...prev, data.new_address]);
      }

      if(isEditing || isAdd) {
        const target = location.state?.slug ? `/${location.state.slug}` : "/myaccount/addresses";
        navigate(target);
        // console.log('location',location);
      } else {
        navigate("/myaccount/addresses");
        window.location.reload();
      }

     
      // window.location.reload();
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteAddress = async () => {
    if(!addressToCancel) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/delete_customer_shipping_addresses/${addressToCancel}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete address");
      setShippingAddresses((prev) => prev.filter((address) => address.id !== addressToCancel));
      setLoading(false);
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setLoading(false);
      setShowWarning(false);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4 mx-4 md:mx-0">
        {/* add address */}
        <Box component="form" onSubmit={handleSaveAddress}>
        <h5 className="font-medium">{isEditing ? "Edit Shipping Address" : "Add New Shipping Address"}</h5>
          <FormControl sx={{ fontSize: '12px' }} fullWidth margin="normal">
            <InputLabel sx={{ background: 'white' }}>Type of Address</InputLabel>
            <Select
              value={newAddress.address_label}
              onChange={(e) => setNewAddress({ ...newAddress, address_label: e.target.value })}
              required
            >
              <MenuItem value="home">Home</MenuItem>
              <MenuItem value="office">Office</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </Select>
          </FormControl>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
              value={newAddress.full_name}
              onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
              required
            />

            <TextField label="Email" type="email" fullWidth margin="normal" value={newAddress.email} onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField label="Mobile Number" fullWidth margin="normal" value={newAddress.mobile_number} onChange={(e) => setNewAddress({ ...newAddress, mobile_number: e.target.value })} required />
            <TextField label="Alt Mobile Number (Optional)" fullWidth margin="normal" value={newAddress.alt_mob_number} onChange={(e) => setNewAddress({ ...newAddress, alt_mob_number: e.target.value })} />
          </div>

          <TextField label="Address Line 1" multiline fullWidth margin="normal" value={newAddress.address_line_1} onChange={(e) => setNewAddress({ ...newAddress, address_line_1: e.target.value })} required />

          <Box display="flex" gap={2}>
            <TextField label="City" fullWidth margin="normal" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
            <TextField label="State" fullWidth margin="normal" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
          </Box>

          <Box display="flex" gap={2}>
            <TextField label="Zip Code" fullWidth margin="normal" value={newAddress.zip_code} onChange={(e) => setNewAddress({ ...newAddress, zip_code: e.target.value })} />
            <TextField label="Country" fullWidth margin="normal" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
          </Box>

          <button type="submit" className={`${themeBgColor} text-white p-2 rounded-md mt-2 text-center block`}>
        {isEditing ? "Update Address" : "Add Address"}
      </button>

        </Box>

        {/* address list */}
        <div>
          {shippingAddresses.length > 0  && (
            <div className="flex flex-wrap flex-col gap-6">
              {shippingAddresses.map((ship) => ship ? (
                <div
                  key={ship.id}
                  className="w-full p-4 border rounded-lg shadow-md bg-white relative"
                >
                  <div className="font-semibold text-lg text-gray-800">
                    {ship.full_name}
                    <Link
                      to="/myaccount/addresses" state={{ address: ship }}
                      className="text-black text-sm absolute right-6 top-2"
                    >
                      ✏️
                    </Link>
                  </div>
                  <div className="text-sm text-gray-600">{ship.address_label}</div>
                  <div className="mt-2 text-gray-800">
                    <p>{ship.address_line_1}</p>
                    {ship.address_line_2 && <p>{ship.address_line_2}</p>}
                    <p>
                      {ship.city}, {ship.state} - {ship.zip_code}
                    </p>
                    {ship.country && <p>{ship.country}</p>}
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      Email: <span className="text-gray-800">{ship.email}</span>
                    </p>
                    <p>
                      Mobile: <span className="text-gray-800">{ship.mobile_number}</span>
                    </p>
                    {ship.alt_mob_number && (
                      <p>
                        Alternate Mobile: <span className="text-gray-800">{ship.alt_mob_number}</span>
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    {ship.is_default ? (
                      <span className="text-sm text-black font-semibold">Default Address</span>
                    ) : (
                      <span className="text-sm text-gray-500"></span>
                    )}
                  </div>
                  <div className="mt-4">
                    {/* Add delete button */}
                    <button
                      onClick={() => { setShowWarning(true); setAddressToCancel(ship.id); }}
                      className="text-black text-sm absolute right-3 top-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : null)}
            </div>
          ) }
        </div>
      </div>

      {showWarning && (
        <div className={`fixed inset-0 ${themeBgColor} bg-opacity-50 flex items-center justify-center z-50`}>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-xs text-gray-700">
              Your shipping address will be deleted permanently
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <button onClick={() => setShowWarning(false)} className="px-4 py-2 bg-gray-300 rounded text-xs">No</button>
              <button onClick={handleDeleteAddress} className={`px-4 py-2 ${themeBgColor} text-white rounded text-xs`} disabled={loading}>
                {loading ? 'Removing...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}





    </>

  );
};

export default ShippingAddress;


