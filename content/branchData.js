import Durgapur from "../components/branches/Durgapur";
import LakeGarden from "../components/branches/LakeGarden";
import ReviewSlider from "../components/branches/ReviewSlider";
import SaltLake from "../components/branches/SaltLake";
import Siliguri from "../components/branches/Siliguri";
import SingleSlider from "../components/SingleSlider";
import reviewData from "./reviewsData";

export const branchData = {
  kolkata: {
    name: "Lake Gardens",
    address:
      "1A, Sultan Alam Rd, Lake Gardens, Kolkata, West Bengal 700033",
    phones: ["+91 8910097668", "+91 7980221032" ],
    image: "/images/lake-garden-office.png",
    page_title:"Kolkata– Best Hair Patch in Lake Gardens Kolkata",
    banner_img:"/images/lake-garden.jpg",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14743.793822821972!2d88.34616800000002!3d22.506117000000003!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0271ee3d777485%3A0xb3e1a11acb3b0e44!2sIndian%20Hair%20World!5e0!3m2!1sen!2sin!4v1769174791072!5m2!1sen!2sin" ,
    component: <LakeGarden/>,
    menProduct: <SingleSlider slug_name="get_slug_data/men" title="MEN’S HAIR PRODUCTS" />,
    womenProduct: <SingleSlider slug_name="get_slug_data/women" title="WOMEN’S HAIR PRODUCTS" />,
    reviews: <ReviewSlider data={reviewData.lakeGarden} />,
  },
  "salt-lake" : {
    name: "Salt Lake",
    address:
      "EC-20, Ground Floor Back Side. Opp. CC1, Sector-1, Salt Lake City, Kolkata, West Bengal 700064",
    phones: ["+91 8961194044"],
    image: "/images/salt-lake-office.png",
    page_title:"Best Hair Patch in Salt Lake, Kolkata",
    banner_img:"/images/salt-lake.jpg",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14735.131250655555!2d88.408487!3d22.587225!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027536b38aad3b%3A0x2fcf6656de9f0225!2sIndian%20Hair%20World%20Salt%20Lake%20%7C%20Non-Surgical%20Hair%20Replacement%20Services%20for%20Best%20Hair%20Patch%20and%20Hair%20Wigs%20In%20Kolkata!5e0!3m2!1sen!2sin!4v1769174890975!5m2!1sen!2sin",
    component: <SaltLake/>,
    menProduct: <SingleSlider slug_name="get_slug_data/men" title="MEN’S HAIR PRODUCTS" />,
    womenProduct: <SingleSlider slug_name="get_slug_data/women" title="WOMEN’S HAIR PRODUCTS" />,
    reviews: <ReviewSlider data={reviewData.saltLake} />,
  },
  durgapur: {
    name: "Durgapur",
    address:
      "2nd Floor, Above PNB, City Center, Durgapur, West Bengal 713216",
    phones: ["+91 9875517402", "+91 8910652352"],
    image: "/images/durgapur-office.png",
    page_title:"Durgapur – Best Hair Patch in Durgapur",
    banner_img:"/images/durgapur.jpg",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14631.399763222813!2d87.293191!3d23.537899!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f773e265d7a933%3A0x2ad4399c8d04faf5!2sINDIAN%20HAIR%20WORLD%20(DURGAPUR)!5e0!3m2!1sen!2sin!4v1769175040174!5m2!1sen!2sin",
    component: <Durgapur/>,
    menProduct: <SingleSlider slug_name="get_slug_data/men" title="MEN’S HAIR PRODUCTS" />,
    womenProduct: <SingleSlider slug_name="get_slug_data/women" title="WOMEN’S HAIR PRODUCTS" />,
    reviews: <ReviewSlider data={reviewData.durgapur} />,
  },
  siliguri: {
    name: "Siliguri",
    address:
      "City Plaza, 2nd Floor, Shop No 3, Sevoke Road, Siliguri, West Bengal 734001",
    phones: ["+91 7439436698"],
    mapUrl:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14254.005381321096!2d88.43067!3d26.728373!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e4416ca8690379%3A0x72b0c331c2df8498!2sIndian%20Hair%20World%20Siliguri!5e0!3m2!1sen!2sin!4v1769175086449!5m2!1sen!2sin",
    page_title:"Siliguri– Best Hair Patch in Siliguri",
    image: "/images/siliguri-office.png",
    banner_img:"/images/siliguri.png",
    component: <Siliguri/>,
    menProduct: <SingleSlider slug_name="get_slug_data/men" title="MEN’S HAIR PRODUCTS" />,
    womenProduct: <SingleSlider slug_name="get_slug_data/women" title="WOMEN’S HAIR PRODUCTS" />,
    reviews: <ReviewSlider data={reviewData.siliguri} />,
  },
};