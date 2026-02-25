import VideoReelsSlider, { ReelItem } from '@/components/VideoReelsSlider';

const womenReels: ReelItem[] = [
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
      reels={womenReels}
      viewMoreLink="/women-products"
      sectionTitle="POPULAR"
      sectionTitleHighlight="PRODUCTS"
    />
  );
}
