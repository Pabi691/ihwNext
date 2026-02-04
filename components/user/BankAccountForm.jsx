import React, { useState } from 'react';
import axios from 'axios';
import { themeTextColor } from '../../styles/typography';
import { Link } from '@/components/compat/router';

function BankAccountForm({ order, token }) {
  const [formData, setFormData] = useState({
    account_holder_name: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    branch_name: '',
    account_type: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/addBankAccount`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // console.log('response', response);

      if (response.status === 200) {
        setMessage('Bank account details submitted successfully.');
      } else {
        setMessage('Submission failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while submitting the form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    order.shipping_status === 'Return Accepted' && (
      <>
      <div class="my-8 p-6 bg-white rounded-md shadow-sm border border-gray-200">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Terms & Conditions</h2>
      <ol class="list-decimal list-inside space-y-2 text-gray-700 text-sm leading-relaxed">
        <li>Refund will be issued after successful verification of the product.</li>
        <li>We're not responsible for any mistakes done through the refund form.</li>
        <li>
          We reserve the full rights to stop the refund if all our <Link to={'/return-exchange-policy'}>Return & Exchange Policy</Link> conditions are not met.
          Please refer to the <a href="/return-exchange-policy" class={`${themeTextColor} hover:underline`} >Return & Exchange section</a>.
        </li>
        <li>Refund will take up to 14 business days to get credited to your account.</li>
      </ol>
    </div>

    <div className="max-w-xl my-6 p-4 border border-gray-300 rounded">
        <h3 className="text-lg font-semibold mb-4">Add Bank Account for Refund</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Account Holder Name', name: 'account_holder_name' },
            { label: 'Bank Name', name: 'bank_name' },
            { label: 'Account Number', name: 'account_number' },
            { label: 'IFSC Code', name: 'ifsc_code' },
            { label: 'Branch Name', name: 'branch_name' },
            { label: 'Account Type (e.g., Savings)', name: 'account_type' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-1 border rounded-sm focus:outline-none focus:ring-black focus:border-black"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Bank Details'}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </div>
      </>
      
    )
  );
}

export default BankAccountForm;


