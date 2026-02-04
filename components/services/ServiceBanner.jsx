import React from "react";
import Breadcrumb from "../Breadcrumb";

const ServiceBanner = () => {

    return (
        <>
            <div className="h-[200px] overflow-hidden relative">
                <img className="h-full w-full object-cover" alt="service-banner" src="/images/other-bannar.jpg" />
                <div className="absolute bottom-0 left-[10%]">
                    <Breadcrumb category={'services'} textColor={'text-white'} />
                </div>
            </div>
        </>
    )
}

export default ServiceBanner;