import { useLocation } from "@/components/compat/router";
import useSeo from "../hooks/useSeo";
import SeoHelmet from "../components/SeoHelmet";
import SeoHeadContent from "../components/SeoHeadContent";
import SeoBodyContent from "../components/SeoBodyContent";
import useGlobalContent from "../hooks/useGlobalContent";

const getSlugFromPath = (pathname) => {
  if (pathname === "/") return "home";
  // console.log("Pathname:", pathname);

  const parts = pathname.split("/").filter(Boolean);

  if (!parts.length) return "home";

  const blocked = new Set([
    "login",
    "register",
    "reset-password",
    "email-verification",
    "myaccount",
    "u",
    "logout",
    "checkout",
    "cart",
    "wishlist",
    "payment",
    "thank-you",
  ]);

  if (blocked.has(parts[0])) {
    return null;
  }

  if (parts[0] === "product" && parts[1]) {
    return parts[1];
  }

  // return parts[0];
  return parts[parts.length - 1];
};

const GlobalSeo = () => {
  const location = useLocation();
  const slug = getSlugFromPath(location.pathname);
  const { seo } = useSeo(slug);
  const { globalContentData } = useGlobalContent();

  return (
    <>
      {slug ? (
        <>
          <SeoHelmet seo={seo} />           {/* standard meta tags */}
          <SeoHeadContent headContent={globalContentData?.head ?? ""} /> {/* dynamic scripts/meta */}
          <SeoBodyContent bodyContent={globalContentData?.body ?? ""} />
        </>
      ) : null}
    </>
  );
};

export default GlobalSeo;

