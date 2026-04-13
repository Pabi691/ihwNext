import React from 'react';
import MainLayOut from '../layout/MainLayOut';
import { Link } from '@/components/compat/router';


const ThankYouContact = () => {
  return (
    <MainLayOut>
      <div className="thank-you-container">
        <div className="thank-you-card">
          <img
            src={`/logo.png`}
            alt="Thank You"
            loading="lazy"
            className="thank-you-image"
          />
          <h3 className="text-lg font-semibold text-gray-900">
            Thanks for contacting us!
          </h3>
          <p className="mt-2 text-sm text-gray-900">
            Your message has been sent successfully. We'll be in touch very soon.
          </p>
          <Link to="/" className="thank-you-button">
            Back to Home
          </Link>
        </div>
      </div>
    </MainLayOut>
  );
};

export default ThankYouContact;
