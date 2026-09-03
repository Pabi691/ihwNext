import React from 'react';
import { themeBgColor } from '../../styles/typography';
import { Link } from '@/components/compat/router';

const TopBar = () => {
    return (
        <div className={`hidden md:block ${themeBgColor} header_top`}>
                <div className="bg-gradient-to-r from-[var(--site-promo-from)] to-[var(--site-promo-to)]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center h-10 text-sm text-white">
                            <span>Free Shipping on all orders above ₹999</span>
                            <span className="mx-2">|</span>
                            <Link to={'/shop'} className="underline hover:no-underline">Shop Now</Link>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default TopBar;
