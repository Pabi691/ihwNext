import React from "react";
import Breadcrumb from "../Breadcrumb";

const GalleryBanner = () => {

    return (
        <>
            <div className="h-[200px] overflow-hidden relative">
                <img className="h-full w-full object-cover" alt="contact-banner" src="/images/other-bannar.jpg" />
                <div className="absolute bottom-0 left-[10%]">
                    <Breadcrumb category={'our-gallery'} textColor={'text-white'} />
                </div>
            </div>
        </>
    )
}

export default GalleryBanner;