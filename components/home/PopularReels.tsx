import VideoReelsSlider, { ReelItem } from '@/components/VideoReelsSlider';

const allReels: ReelItem[] = [
    // ── Men's Reels ──
    {
        reelId: 'DR2gOBik31w',
        videoUrl: 'https://www.instagram.com/reel/DR2gOBik31w/',
        productUrl: '/product/03-mm-hair-patch-black',
        thumbnail: 'https://cdn.indianhairworld.com/product-images/0.3-mm-hair-patch-black-2.jpg',
        productName: '0.3 Mm Hair Patch – Black',
        price: 39999,
        salePrice: 24999,
        videoFile: '/videos/men-reel-1.mp4',
    },
    {
        reelId: 'DReVotngTL2',
        videoUrl: 'https://www.instagram.com/reel/DReVotngTL2/',
        productUrl: '/product/hairline-patch-with-net-base-100-natural-human-hair',
        thumbnail: 'https://cdn.indianhairworld.com/product-images/hairline-patch-with-net-base-%E2%80%93-100-percent-natural-human-hair.jpg',
        productName: 'Hairline Patch With Net Base – 100% Natural Human Hair',
        price: 12999,
        salePrice: 4999,
        videoFile: '/videos/men-reel-2.mp4',
    },
    {
        reelId: 'DNaSnEjS2dy',
        videoUrl: 'https://www.instagram.com/reel/DNaSnEjS2dy/',
        productUrl: '/product/curly-hair-patch-with-mono-base-brown',
        thumbnail: 'https://cdn.indianhairworld.com/product-images/curly-hair-patch-with-mono-base-%E2%80%93-brown.jpg',
        productName: 'Curly Hair Patch With Mono Base – Brown',
        price: 14999,
        salePrice: 6999,
        videoFile: '/videos/men-reel-3.mp4',
    },
    // ── Women's Reels ──
    {
        reelId: 'DI3cwGXJ4U0',
        videoUrl: 'https://www.instagram.com/reel/DI3cwGXJ4U0/',
        productUrl: '/product/teal-blue-colors-strands-clip-in-hair',
        thumbnail: 'https://cdn.indianhairworld.com/product-images/teal-blue-colors-strands-%E2%80%93-clip-in-hair-2.jpg',
        productName: 'Teal Blue Colors Strands – Clip In Hair',
        price: 1499,
        salePrice: 899,
        videoFile: '/videos/women-reel-1.mp4',
    },
    {
        reelId: 'DKzWDSZS8EP',
        videoUrl: 'https://www.instagram.com/reel/DKzWDSZS8EP/',
        productUrl: '/product/clip-in-bangs-100-percent-natural-human-hair',
        thumbnail: 'https://cdn.indianhairworld.com/product-images/clip-in-bangs-%E2%80%93-100-percent-natural-human-hair.jpg',
        productName: 'Clip-In Bangs – 100% Natural Human Hair',
        price: 2999,
        salePrice: 1499,
        videoFile: '/videos/women-reel-2.mp4',
    },
    {
        reelId: 'DQbZFv_AS35',
        videoUrl: 'https://www.instagram.com/reel/DQbZFv_AS35/',
        productUrl: '/product/mirage-hair-topper-ladies-black',
        thumbnail: 'https://cdn.indianhairworld.com/product-images/mirage-hair-topper-ladies-black-1.jpg',
        productName: 'Mirage Hair Topper – Ladies Black',
        price: 14999,
        salePrice: 10999,
        videoFile: '/videos/women-reel-3.mp4',
    },
];

export default function PopularReels() {
    return (
        <VideoReelsSlider
            reels={allReels}
            viewMoreLink="/shop"
            sectionTitle="POPULAR"
            sectionTitleHighlight="REELS"
        />
    );
}
