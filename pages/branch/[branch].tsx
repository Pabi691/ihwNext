import React from "react";
import MainLayOut from "@/layout/MainLayOut";
import { DesktopNav } from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SingleSlider from "@/components/SingleSlider";
import BranchContent from "@/components/branches/BranchContent";


const Branches = () => {
    return (
        <>
            <MainLayOut>
                <DesktopNav />
                <HeroSection />
                <BranchContent />
            </MainLayOut>
        </>
    )
}

export const getServerSideProps = async () => {
  return { props: {} };
};

export default Branches;
