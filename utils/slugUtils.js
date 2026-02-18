export const getSlugFromPath = (pathname) => {
    if (!pathname || pathname === "/") return "home";

    const routeToPageMap = {
        home: "home",
        "contact-us": "contact-us",
    };

    const routeSlugAliases = {
        "contact-us": ["contact-us", "contact"],
        "terms-conditions": ["terms-and-conditions", "terms-conditions"],
        "return-exchange-policy": ["return-policy", "return-exchange-policy"],
        men: ["men-products", "men"],
        women: ["women-products", "women"],
        "shipping-and-delivery": ["shipping-and-delivery"],
    };

    // Remove query strings if present
    const cleanPath = pathname.split('?')[0].split('#')[0];
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

    if (routeSlugAliases[parts[0]]) {
        return routeSlugAliases[parts[0]][0];
    }

    if (routeToPageMap[parts[0]]) {
        return routeToPageMap[parts[0]];
    }

    // Determine slug based on the last part of the path
    return parts[parts.length - 1];
};

export const getSeoSlugCandidatesFromPath = (pathname) => {
    if (!pathname || pathname === "/") return ["home"];

    const cleanPath = pathname.split('?')[0].split('#')[0];
    const parts = cleanPath.split("/").filter(Boolean);
    if (!parts.length) return ["home"];

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

    if (blocked.has(parts[0])) return [];

    if (parts[0] === "product" && parts[1]) {
        return [parts[1]];
    }

    const aliasMap = {
        "contact-us": ["contact-us", "contact"],
        "terms-conditions": ["terms-and-conditions", "terms-conditions"],
        "return-exchange-policy": ["return-policy", "return-exchange-policy"],
        men: ["men-products", "men"],
        women: ["women-products", "women"],
        "shipping-and-delivery": ["shipping-and-delivery"],
    };

    const routeKey = parts[0];
    const candidates = aliasMap[routeKey] || [parts[parts.length - 1]];

    return [...new Set(candidates.filter(Boolean))];
};
