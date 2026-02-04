// src/content/navItems.js

export const desktopNavItems = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Gallery", path: "/our-gallery" },

  {
    label: "Branches",
    children: [
      { label: "Lake Gardens, Kolkata", path: "/branch/kolkata" },
      { label: "SaltLake, Kolkata", path: "/branch/salt-lake" },
      { label: "Durgapur", path: "/branch/durgapur" },
      { label: "Siliguri", path: "/branch/siliguri" },
    ],
  },

  { label: "Contact Us", path: "/contact-us" },
];

export const mobileNavItems = [
  // {
  //   label: "Planters",
  //   path: "/planters",
  //   image: "images/mobile/planters.png",
  // },
  // {
  //   label: "Bucket",
  //   path: "/bucket",
  //   image: "images/mobile/bucket.png",
  // },
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },

  {
    label: "Branches",
    children: [
      { label: "Lake Gardens, Kolkata", path: "/branch/kolkata" },
      { label: "SaltLake, Kolkata", path: "/branch/salt-lake" },
      { label: "Durgapur", path: "/branch/durgapur" },
      { label: "Siliguri", path: "/branch/siliguri" },
    ],
  },

  { label: "Contact Us", path: "/contact-us" },
];
