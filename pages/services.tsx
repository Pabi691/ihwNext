import React from "react";
import MainLayOut from "../layout/MainLayOut";
import ServiceBanner from "../components/services/ServiceBanner";
import { DesktopNav } from "../components/Navigation";
import HairServiceSection from "../components/services/HairServiceSection";
import IHWCardSection from "../components/services/IHWCardSection";
import ChooseSection from "../components/services/ChooseSection";
import AboveFooterSection from "../components/services/AboveFooterSection";
import IntroTextSection from "../components/services/IntroTextSection";
import MultiColorHairSection from "../components/services/MultiColorHairSection";
import AppointmentSection from "../components/services/AppointmentSection";

const Services = () => {
    return (
        <>
        <MainLayOut>
            <DesktopNav />
            <ServiceBanner />
            <HairServiceSection />
            <IHWCardSection />
            <ChooseSection />
            <AboveFooterSection />
            <IntroTextSection />
            <MultiColorHairSection />
            <AppointmentSection />
        </MainLayOut>
        </>
    )
}

export default Services;