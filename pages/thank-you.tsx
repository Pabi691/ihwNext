import React, { useEffect, useState } from 'react';
import { Link } from '@/components/compat/router';
import MainLayOut from '../layout/MainLayOut';
import { useGlobal } from '../global/GlobalContext';


const ThankYou = () => {

  const { token } = useGlobal();
  const [orderId, setOrderId] = useState<any>(null);
  useEffect(() => {
    const fetchOrderId = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_my_orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        // console.log('data', data);
        setOrderId(data.orders[0]);
        // console.log('get my order',data);
        return data;
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrderId();
  }, [token]);


  return (
    <MainLayOut>
      <div className="thank-you-container">
        <div className="thank-you-card">
          <img
            src={`/logo.png`}
            alt="Thank You" loading="lazy"
            className="thank-you-image"
          />
          {orderId ?
            (
              <>
                <h1 className="thank-you-title">Thank You for Your Order!</h1>
                <p className="thank-you-message">
                  We truly appreciate your trust in us. Your order has been placed successfully!
                </p>
                <div className="thank-you-details">
                  <p>Order ID: <strong>#IHW{orderId.id}</strong></p> {/* Replace dynamically */}
                  <p>Estimated Delivery: <strong>3-5 Business Days</strong></p>
                </div>
                <Link to="/" className="thank-you-button">
                  Continue Shopping
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900">
                  Thanks for contacting us!
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Your message has been sent successfully. We’ll be in touch very soon.
                </p>
              </>

            )
          }

        </div>
      </div>
    </MainLayOut>

  );
};

export default ThankYou;



