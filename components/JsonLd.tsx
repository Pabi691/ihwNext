import Head from "next/head";

const SITE_URL = "https://www.indianhairworld.com";

type BreadcrumbItem = {
  name: string;
  url: string;
};

type LocalBusinessProps = {
  name: string;
  address: string;
  telephone: string;
  url: string;
  image?: string;
  geo?: { lat: number; lng: number };
  sameAs?: string[];
};

type ServiceProps = {
  name: string;
  description: string;
  url: string;
  provider?: string;
  image?: string;
};

type JsonLdProps = {
  /** Renders Organization + WebSite schema (use on Home page) */
  organization?: boolean;
  /** Renders LocalBusiness schema (use on Branch pages) */
  localBusiness?: LocalBusinessProps;
  /** Renders Service schema (use on Men/Women pages) */
  service?: ServiceProps;
  /** Renders BreadcrumbList schema */
  breadcrumbs?: BreadcrumbItem[];
};

const JsonLd = ({ organization, localBusiness, service, breadcrumbs }: JsonLdProps) => {
  const schemas: object[] = [];

  if (organization) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Indian Hair World",
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.png`,
      description:
        "India's leading non-surgical hair replacement brand. Premium hair patches, wigs, toppers & extensions for men and women.",
      sameAs: [
        "https://www.facebook.com/Indianhairworld.services/",
        "https://www.instagram.com/indianhairworld.service/",
        "https://www.linkedin.com/in/indian-hair-world-saltlake-627704301/",
        "https://www.youtube.com/channel/UC5zfRMVUFshI1PxoxJxW51w",
        "https://www.pinterest.com/indianhairworldsaltlake/",
        "https://www.threads.com/@indianhairworld.service",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-7980221032",
        contactType: "customer service",
        availableLanguage: ["English", "Hindi", "Bengali"],
      },
    });

    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Indian Hair World",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    });
  }

  if (localBusiness) {
    const lb: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: localBusiness.name,
      url: localBusiness.url,
      telephone: localBusiness.telephone,
      address: {
        "@type": "PostalAddress",
        streetAddress: localBusiness.address,
        addressLocality: localBusiness.name.replace("Indian Hair World - ", ""),
        addressRegion: "West Bengal",
        addressCountry: "IN",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "11:00",
        closes: "19:00",
      },
      priceRange: "₹₹",
    };
    if (localBusiness.image) {
      lb.image = localBusiness.image;
    }
    if (localBusiness.geo) {
      lb.geo = {
        "@type": "GeoCoordinates",
        latitude: localBusiness.geo.lat,
        longitude: localBusiness.geo.lng,
      };
    }
    if (localBusiness.sameAs && localBusiness.sameAs.length > 0) {
      lb.sameAs = localBusiness.sameAs;
    }
    schemas.push(lb);
  }

  if (service) {
    const svc: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: service.description,
      url: service.url,
      provider: {
        "@type": "Organization",
        name: service.provider || "Indian Hair World",
        url: SITE_URL,
      },
      areaServed: {
        "@type": "Country",
        name: "India",
      },
    };
    if (service.image) {
      svc.image = service.image;
    }
    schemas.push(svc);
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  if (schemas.length === 0) return null;

  return (
    <Head>
      {schemas.map((schema, i) => (
        <script
          key={`jsonld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Head>
  );
};

export default JsonLd;
