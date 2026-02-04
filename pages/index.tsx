import React from "react";
import MainLayOut from '../layout/MainLayOut';
import HeroSection from '../components/HeroSection';
import HomeBody from '../components/home/HomeBody';
import MobileHomeBody from "@/components/mobileComponents/MobileHomeBody";
import { DesktopNav, MobileNav } from "../components/Navigation";
import TopBar from "../components/home/TopBar";

const Home = () => {

    return (
        <>
            <TopBar />
            <MainLayOut>
                <DesktopNav />
                {/* <MobileNav /> */}
                <HeroSection />
                <div className="hidden md:block">
                    <HomeBody />
                </div>
                <div className="md:hidden">
                    <MobileHomeBody />
                </div>
            </MainLayOut>
        </>
    )
}

export default Home;
