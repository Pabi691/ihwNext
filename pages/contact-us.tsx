import React from 'react';
import MainLayOut from '../layout/MainLayOut';
import { DesktopNav } from '../components/Navigation';
import SearchableTabs from '../components/contact/SearchableTabs';
import ContactBanner from '../components/contact/ContactBanner';
import BranchContactSections from '../components/branches/BranchContactSections';
import ContactFormSection from '../components/contact/ContactFormSection';


const Contact = () =>{
    return(
        <>
        <MainLayOut>
            <DesktopNav />
            <ContactBanner />
            <BranchContactSections />
            <ContactFormSection />
            <SearchableTabs />

        </MainLayOut>
        </>
    )
}

export default Contact;