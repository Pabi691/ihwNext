import VideoReelsSlider, { ReelItem } from '@/components/VideoReelsSlider';

const menReels: ReelItem[] = [
  {
    reelId: 'DViJYP1DEQQ',
    videoUrl: 'https://www.instagram.com/reel/DViJYP1DEQQ/',
    productUrl: '/product/model-hair-patch-black',
    thumbnail: 'https://cdn.indianhairworld.com/product-images/model-hair-patch-black.jpg',
    productName: 'Model Hair Patch – Black',
    price: 9999,
    salePrice: 6999,
    videoFile: '/videos/men-reel-4.mp4',
  },
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
];

export default function PopularReels() {
  return (
    <VideoReelsSlider
      reels={menReels}
      viewMoreLink="/men-products"
      sectionTitle="POPULAR"
      sectionTitleHighlight="PRODUCTS"
    />
  );
}
