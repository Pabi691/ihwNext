import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Link } from '@/components/compat/router';
import { ENV } from '@/config/env';
import MainLayOut from '../layout/MainLayOut';
import { useGlobal } from '../global/GlobalContext';

const ThankYou = () => {
  const apiBaseUrl = ENV.API_URL;
  const { token } = useGlobal();
  const [orderId, setOrderId] = useState<any>(null);

  useEffect(() => {
    const fetchOrderId = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/get_my_orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setOrderId(data.orders[0]);
        return data;
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrderId();
  }, [token]);

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `gtag('event', 'conversion_event_purchase_2', {});`,
          }}
        />
      </Head>
      <MainLayOut>
        <div className="thank-you-container">
          <div className="thank-you-card">
            <img
              src={`/logo.png`}
              alt="Thank You"
              loading="lazy"
              className="thank-you-image"
            />
            <h1 className="thank-you-title">Thank You for Your Order!</h1>
            <p className="thank-you-message">
              We truly appreciate your trust in us. Your order has been placed successfully!
            </p>
            {orderId && (
              <div className="thank-you-details">
                <p>Order ID: <strong>#IHW{orderId.id}</strong></p>
                <p>Estimated Delivery: <strong>3-5 Business Days</strong></p>
              </div>
            )}
            <Link to="/" className="thank-you-button">
              Continue Shopping
            </Link>
          </div>
        </div>
      </MainLayOut>
    </>
  );
};

export default ThankYou;
