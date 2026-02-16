export const getSlugFromPath = (pathname) => {
    if (!pathname || pathname === "/") return "home";

    // Remove query strings if present
    const cleanPath = pathname.split('?')[0];
    const parts = cleanPath.split("/").filter(Boolean);

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

    // Determine slug based on the last part of the path
    return parts[parts.length - 1];
};
