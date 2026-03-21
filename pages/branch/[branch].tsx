import React from "react";
import MainLayOut from "@/layout/MainLayOut";
import { DesktopNav } from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SingleSlider from "@/components/SingleSlider";
import BranchContent from "@/components/branches/BranchContent";
import PopularReels from "@/components/home/PopularReels";
import OurWorks from "@/components/home/OurWorks";


const Branches = () => {
    return (
        <>
            <MainLayOut>
                <DesktopNav />
                <HeroSection />
                {/* Shark Tank Images */}
                <div className="w-full my-4 md:my-8 flex justify-center">
                    <div className="w-full max-w-7xl px-4 md:px-8">
                        <img
                            src="/images/sharkDesk.jpeg"
                            alt="Featured on Shark Tank"
                            className="hidden md:block w-full h-auto object-contain rounded-lg"
                        />
                        <img
                            src="/images/sharkMobile.png"
                            alt="Featured on Shark Tank"
                            className="block md:hidden w-full h-auto object-contain rounded-lg"
                        />
                    </div>
                </div>
                <PopularReels />
                <OurWorks />
                <BranchContent />
            </MainLayOut>
        </>
    )
}

export const getServerSideProps = async () => {
    return { props: {} };
};

export default Branches;
