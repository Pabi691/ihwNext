import React from "react";
import MainLayOut from "../layout/MainLayOut";
import { DesktopNav } from "../components/Navigation";
import TransformationsGallery from "../components/gallery/TransformationsGallery";
import GlobalFameAwardsGallery from "../components/gallery/GlobalFameAwardsGallery";
import TimesBrandIcons2024 from "../components/gallery/TimesBrandIcons2024";
import VideoGallery from "../components/gallery/VideoGallery";
import GalleryBanner from "../components/gallery/GalleryBanner";

const Gallery = () => {
    return (
        <MainLayOut>
            <DesktopNav />
            <GalleryBanner />
            <TransformationsGallery />
            <GlobalFameAwardsGallery />
            <TimesBrandIcons2024 />
            <VideoGallery />
        </MainLayOut>
    )
}

export default Gallery;