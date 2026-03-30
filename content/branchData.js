import Durgapur from "../components/branches/Durgapur";
import LakeGarden from "../components/branches/LakeGarden";
import ReviewSlider from "../components/branches/ReviewSlider";
import SaltLake from "../components/branches/SaltLake";
import Siliguri from "../components/branches/Siliguri";
import SingleSlider from "../components/SingleSlider";
import reviewData from "./reviewsData";

export const branchData = {
  kolkata: {
    name: "Lake Gardens, Kolkata",
    h1: "Best Hair Patch & Non-Surgical Hair Replacement in Lake Gardens, Kolkata",
    paragraph: "Looking for the best hair patch in Lake Gardens, Kolkata? Indian Hair World is Kolkata's most awarded non-surgical hair replacement center — as featured on Shark Tank India. Our Lake Gardens branch, near Tollygunge Metro, offers 100% natural hair patches, hair wigs, and complete hair replacement without surgery, starting at just Rs.5999. Our expert team covers every bald spot with an undetectable, natural-looking result in just 60 minutes. EMI available. Call +917980221032 or WhatsApp for a free consultation at our Lake Gardens branch today.",
    address:
      "1A, Sultan Alam Rd, Lake Gardens, Kolkata, West Bengal 700033",
    phones: ["+917980221032"],
    whatsapp: "+917980221032",
    landmark: "Near Tollygunge Metro Station",
    opening_hours: "Monday to Sunday — 11:00 AM to 7:00 PM",
    serving_areas: "Lake Gardens, Tollygunge, Gariahat, Behala, New Alipore, Ballygunge, south Kolkata",
    image: "/images/lake-garden-office.png",
    page_title: "Non Surgical Hair Replacement in Lake Gardens, Kolkata – Natural Looking Hair Patch, Extensions & Topper",
    banner_img: "/images/lake-garden.jpg",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14743.793822821972!2d88.34616800000002!3d22.506117000000003!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0271ee3d777485%3A0xb3e1a11acb3b0e44!2sIndian%20Hair%20World!5e0!3m2!1sen!2sin!4v1769174791072!5m2!1sen!2sin",
    component: <LakeGarden />,
    menProduct: <SingleSlider slug_name="get_slug_data/men-products" title="MEN’S HAIR PRODUCTS" />,
    womenProduct: <SingleSlider slug_name="get_slug_data/women-products" title="WOMEN’S HAIR PRODUCTS" />,
    reviews: <ReviewSlider data={reviewData.lakeGarden} />,
    faqs: [
      { question: "What is the cost of a hair patch in Lake Gardens, Kolkata?", answer: "Hair patches in Lake Gardens at Indian Hair World start from Rs.5999. We also offer easy EMI options. Prices vary based on the type of patch, coverage area and fixing method. Call +917980221032 or WhatsApp for a free price consultation." },
      { question: "Is the hair patch result natural and undetectable?", answer: "Yes — 100%. Our hair patches in Kolkata use premium natural Indian human hair matched to your colour and texture. Friends and family will not be able to tell the difference. We guarantee a natural, undetectable result or we re-do it free of charge." },
      { question: "How is hair patch different from hair transplant in Kolkata?", answer: "Hair transplant in Kolkata costs Rs.70,000+ with 2–3 weeks of recovery time and surgical risk. Our non-surgical hair replacement gives the same natural result from Rs.5999 in just 60 minutes — no surgery, no scars, no downtime. It is reversible and risk-free." },
      { question: "Where is your Lake Gardens branch located?", answer: "We are at 1A, Sultan Alam Road, Lake Gardens, Kolkata 700033 — near Tollygunge Metro Station. Open Monday to Sunday, 11am to 7pm. No prior appointment is needed — walk in directly or call +917980221032." },
      { question: "Can I swim or go to the gym with a hair patch?", answer: "Yes — once properly bonded, you can swim, go to the gym, run in rain, wear a helmet and do all normal activities. There are zero activity restrictions with a professionally fixed hair patch from our Lake Gardens branch." },
      { question: "Do you also serve Tollygunge, Gariahat and Behala?", answer: "Yes — our Lake Gardens hair patch center serves all of south Kolkata including Tollygunge, Gariahat, Behala, New Alipore and Ballygunge. We are the nearest professional hair replacement center for all these areas." }
    ],
  },
  "salt-lake": {
    name: "Salt Lake, Kolkata",
    h1: "Best Hair Patch in Kolkata – Non Surgical Hair Replacement",
    paragraph: "Indian Hair World is the best hair patch centre in Kolkata, specializing in non surgical hair replacement since 2015. We offer premium hair patch for men in Kolkata that gives a completely natural, undetectable look — no surgery, no pain, no side effects. Looking for a hair patch near me? Our non surgical hair replacement centre in Kolkata has two branches — Lake Gardens and Salt Lake. Walk in for a free consultation today. Wondering about hair patch price in Kolkata? Our services start at just ₹5,999 — the most affordable hair patch in Kolkata. We use 100% human hair patch for a premium, natural finish. The hair patch cost in Kolkata varies based on base type, density, and coverage area. We also provide professional hair patch servicing in Kolkata, including re-bonding, cleaning, and maintenance to keep your non surgical hair replacement looking fresh for months.",
    address:
      "EC-20, Ground Floor Back Side. Opp. CC1, Sector-1, Salt Lake City, Kolkata, West Bengal 700064",
    phones: ["+918961194044"],
    whatsapp: "+918961194044",
    landmark: "Opp. CC1, Sector-1",
    opening_hours: "Monday to Sunday — 11:00 AM to 7:00 PM",
    serving_areas: "Salt Lake, New Town, Rajarhat, and surrounding areas",
    image: "/images/salt-lake-office.png",
    page_title: "Non Surgical Hair Replacement in Saltlake, Kolkata – Natural Looking Hair Patch, Extensions & Topper",
    banner_img: "/images/salt-lake.jpg",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14735.131250655555!2d88.408487!3d22.587225!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027536b38aad3b%3A0x2fcf6656de9f0225!2sIndian%20Hair%20World%20Salt%20Lake%20%7C%20Non-Surgical%20Hair%20Replacement%20Services%20for%20Best%20Hair%20Patch%20and%20Hair%20Wigs%20In%20Kolkata!5e0!3m2!1sen!2sin!4v1769174890975!5m2!1sen!2sin",
    component: <SaltLake />,
    menProduct: <SingleSlider slug_name="get_slug_data/men-products" title="MEN’S HAIR PRODUCTS" />,
    womenProduct: <SingleSlider slug_name="get_slug_data/women-products" title="WOMEN’S HAIR PRODUCTS" />,
    reviews: <ReviewSlider data={reviewData.saltLake} />,
    faqs: [
      { question: "What is the cost of a hair patch in Salt Lake, Kolkata?", answer: "Hair patches in Salt Lake at Indian Hair World start from Rs.5999. We also offer easy EMI options. Prices vary based on the type of patch, coverage area and fixing method. Call +918961194044 or WhatsApp for a free price consultation." },
      { question: "Is the hair patch result natural and undetectable?", answer: "Yes — 100%. Our hair patches in Kolkata use premium natural Indian human hair matched to your colour and texture. Friends and family will not be able to tell the difference. We guarantee a natural, undetectable result or we re-do it free of charge." },
      { question: "How is hair patch different from hair transplant?", answer: "Hair transplants cost Rs.70,000+ with weeks of recovery time and surgical risk. Our non-surgical hair replacement gives the same natural result from Rs.5999 in just 60 minutes — no surgery, no scars, no downtime. It is reversible and risk-free." },
      { question: "Where is your Salt Lake branch located?", answer: "We are at EC-20, Ground Floor Back Side. Opp. CC1, Sector-1, Salt Lake City, Kolkata 700064. Open Monday to Sunday, 11am to 7pm. No prior appointment is needed — walk in directly or call +918961194044." },
      { question: "Can I swim or go to the gym with a hair patch?", answer: "Yes — once properly bonded, you can swim, go to the gym, run in rain, wear a helmet and do all normal activities. There are zero activity restrictions with a professionally fixed hair patch from our Salt Lake branch." },
      { question: "Do you serve surrounding areas?", answer: "Yes — our Salt Lake hair patch center serves all of Salt Lake, New Town, Rajarhat, and surrounding areas. We are the nearest professional hair replacement center for these locations." }
    ],
  },
  durgapur: {
    name: "Durgapur",
    h1: "Best Hair Patch & Non-Surgical Hair Replacement in Durgapur",
    paragraph: "Looking for the best hair patch in Durgapur? Indian Hair World's Durgapur branch — at City Center, above PNB — is the first Shark Tank India featured non-surgical hair replacement center in the Durgapur-Asansol belt. We provide 100% natural hair patches, hair wigs, and hair replacement without surgery for men and women across Durgapur, Asansol and Burnpur, starting at Rs.5999. The best hair transplant alternative in Durgapur. Natural result in 60 minutes. EMI available. Call +919875517402 for a free consultation.",
    address:
      "2nd Floor, Above PNB, City Center, Durgapur, West Bengal 713216",
    phones: ["+919875517402", "+918910652352"],
    whatsapp: "+919875517402",
    landmark: "Above PNB, City Center",
    opening_hours: "Monday to Sunday — 11:00 AM to 7:00 PM",
    serving_areas: "Durgapur and surrounding areas",
    image: "/images/durgapur-office.png",
    page_title: "Non Surgical Hair Replacement in Durgapur – Natural Looking Hair Patch, Extensions & Topper",
    banner_img: "/images/durgapur.jpg",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14631.399763222813!2d87.293191!3d23.537899!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f773e265d7a933%3A0x2ad4399c8d04faf5!2sINDIAN%20HAIR%20WORLD%20(DURGAPUR)!5e0!3m2!1sen!2sin!4v1769175040174!5m2!1sen!2sin",
    component: <Durgapur />,
    menProduct: <SingleSlider slug_name="get_slug_data/men-products" title="MEN’S HAIR PRODUCTS" />,
    womenProduct: <SingleSlider slug_name="get_slug_data/women-products" title="WOMEN’S HAIR PRODUCTS" />,
    reviews: <ReviewSlider data={reviewData.durgapur} />,
    faqs: [
      { question: "What is the cost of a hair patch in Durgapur?", answer: "Hair patches in Durgapur at Indian Hair World start from Rs.5999. We also offer easy EMI options. Prices vary based on the type of patch, coverage area and fixing method. Call +919875517402 or WhatsApp for a free price consultation." },
      { question: "Is the hair patch result natural and undetectable?", answer: "Yes — 100%. Our hair patches use premium natural Indian human hair matched to your colour and texture. Friends and family will not be able to tell the difference. We guarantee a natural, undetectable result or we re-do it free of charge." },
      { question: "How is hair patch different from hair transplant?", answer: "Hair transplants cost Rs.70,000+ with weeks of recovery time and surgical risk. Our non-surgical hair replacement gives the same natural result from Rs.5999 in just 60 minutes — no surgery, no scars, no downtime. It is reversible and risk-free." },
      { question: "Where is your Durgapur branch located?", answer: "We are on the 2nd Floor, Above PNB, City Center, Durgapur, West Bengal 713216. Open Monday to Sunday, 11am to 7pm. No prior appointment is needed — walk in directly or call +919875517402." },
      { question: "Can I swim or go to the gym with a hair patch?", answer: "Yes — once properly bonded, you can swim, go to the gym, run in rain, wear a helmet and do all normal activities. There are zero activity restrictions with a professionally fixed hair patch from our center." }
    ],
  },
  siliguri: {
    name: "Siliguri",
    h1: "Best Hair Patch & Non-Surgical Hair Replacement in Siliguri",
    paragraph: "Looking for the best hair patch in Siliguri? Indian Hair World's Siliguri branch — at City Plaza, Sevoke Road — is North Bengal's first Shark Tank India featured non-surgical hair replacement center. We provide 100% natural hair patches, hair wigs, and hair replacement without surgery for men and women across Siliguri, Jalpaiguri and Darjeeling district, starting at Rs.5999. The best hair transplant alternative in Siliguri. Natural result in 60 minutes. EMI available. Call +917439436698 for a free consultation.",
    address:
      "City Plaza, 2nd Floor, Shop No 3, Sevoke Road, Siliguri, West Bengal 734001",
    phones: ["+917439436698"],
    whatsapp: "+917439436698",
    landmark: "City Plaza, Sevoke Road",
    opening_hours: "Monday to Sunday — 11:00 AM to 7:00 PM",
    serving_areas: "Siliguri, Jalpaiguri, and North Bengal",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14254.005381321096!2d88.43067!3d26.728373!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e4416ca8690379%3A0x72b0c331c2df8498!2sIndian%20Hair%20World%20Siliguri!5e0!3m2!1sen!2sin!4v1769175086449!5m2!1sen!2sin",
    page_title: "Non Surgical Hair Replacement in Siliguri – Natural Looking Hair Patch, Extensions & Topper",
    image: "/images/siliguri-office.png",
    banner_img: "/images/siliguri.png",
    component: <Siliguri />,
    menProduct: <SingleSlider slug_name="get_slug_data/men-products" title="MEN’S HAIR PRODUCTS" />,
    womenProduct: <SingleSlider slug_name="get_slug_data/women-products" title="WOMEN’S HAIR PRODUCTS" />,
    reviews: <ReviewSlider data={reviewData.siliguri} />,
    faqs: [
      { question: "What is the cost of a hair patch in Siliguri?", answer: "Hair patches in Siliguri at Indian Hair World start from Rs.5999. We also offer easy EMI options. Prices vary based on the type of patch, coverage area and fixing method. Call +917439436698 or WhatsApp for a free price consultation." },
      { question: "Is the hair patch result natural and undetectable?", answer: "Yes — 100%. Our hair patches use premium natural Indian human hair matched to your colour and texture. Friends and family will not be able to tell the difference. We guarantee a natural, undetectable result or we re-do it free of charge." },
      { question: "How is hair patch different from hair transplant?", answer: "Hair transplants cost Rs.70,000+ with weeks of recovery time and surgical risk. Our non-surgical hair replacement gives the same natural result from Rs.5999 in just 60 minutes — no surgery, no scars, no downtime. It is reversible and risk-free." },
      { question: "Where is your Siliguri branch located?", answer: "We are at City Plaza, 2nd Floor, Shop No 3, Sevoke Road, Siliguri, West Bengal 734001. Open Monday to Sunday, 11am to 7pm. No prior appointment is needed — walk in directly or call +917439436698." },
      { question: "Can I swim or go to the gym with a hair patch?", answer: "Yes — once properly bonded, you can swim, go to the gym, run in rain, wear a helmet and do all normal activities. There are zero activity restrictions with a professionally fixed hair patch from our Siliguri branch." }
    ],
  },
};