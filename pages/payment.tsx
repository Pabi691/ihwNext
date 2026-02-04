import React, { useEffect, useState } from 'react';
import { Link } from '@/components/compat/router';
import MainLayOut from '../layout/MainLayOut';
import { useGlobal } from '../global/GlobalContext';


const Payment = () => {

    const { token } = useGlobal();
    const [ orderId, setOrderId ] = useState<any>(null);
    useEffect(()=>{
        const fetchOrderId = async () => {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_my_orders`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    }
              });
              const data = await response.json();
              setOrderId(data.orders[0]);
              // console.log('get my order',data);
              return data;
            } catch (error) {
              console.error(error);
            }
          };
          
          fetchOrderId();
    },[token]);

   
      
  return (
    <MainLayOut>
<div className="thank-you-container">
      <div className="thank-you-card">
        <img
          src={`/logo.png`}
          alt="Thank You"
          className="thank-you-image" loading="lazy"
        />
        <h1 className="thank-you-title">Thank You for Your Order!</h1>
        <p className="thank-you-message">
          We truly appreciate your trust in us. Your order has been placed successfully!
        </p>
        <div className="thank-you-details">
          <p>Order ID: <strong>#IHW{orderId?.id ?? ""}</strong></p> {/* Replace dynamically */}
          <p>Estimated Delivery: <strong>3-5 Business Days</strong></p>
        </div>
        <Link to="/" className="thank-you-button">
          Continue Shopping
        </Link>
      </div>
    </div>
    </MainLayOut>
    
  );
};

export default Payment;



