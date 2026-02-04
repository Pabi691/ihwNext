import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BankAccountForm from './BankAccountForm';

function BankDetails({ order, token }) {
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBank = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/getCustomerBankAccounts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200 && response.data.bankAccounts.length > 0) {
          setBankDetails(response.data.bankAccounts[0]);
        } else {
          setBankDetails(null);
          // setMessage('No bank account found.');
        }
      } catch (error) {
        console.error('Error fetching bank details:', error);
        // setMessage('Failed to load bank details.');
        setBankDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBank();
  }, [token]);

  if (loading) return <p>Loading bank details...</p>;

  if (!bankDetails) {
    return <BankAccountForm order={order} token={token} />;
  }

  return (
    <div className="my-6 p-4 border border-gray-300 rounded">
      <h3 className="text-lg font-semibold mb-4">Banking Details</h3>
      <p className='text-sm'><span className='font-semibold'>Account Holder Name:</span> {bankDetails.account_holder_name}</p>
      <p className='text-sm'><span className='font-semibold'>Account Number:</span> {bankDetails.account_number ? `****${bankDetails.account_number.slice(-4)}` : 'N/A'}</p>
      <p className='text-sm'><span className='font-semibold'>Account Type:</span> {bankDetails.account_type}</p>
      <p className='text-sm'><span className='font-semibold'>Bank Name:</span> {bankDetails.bank_name}</p>
      <p className='text-sm'><span className='font-semibold'>Branch Name:</span> {bankDetails.branch_name}</p>
      <p className='text-sm'><span className='font-semibold'>IFSC Code:</span> {bankDetails.ifsc_code}</p>
    </div>
  );
}

export default BankDetails;

