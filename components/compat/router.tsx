import React, { useEffect, useMemo } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

const NAV_STATE_PREFIX = "__nav_state__:";

type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
};

type LinkProps = Omit<React.ComponentProps<typeof NextLink>, "href"> & {
  to?: string;
  href?: string;
  state?: unknown;
};

type LocationLike = {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
};

const storeNavState = (to: string, state: unknown) => {
  if (typeof window === "undefined") return;
  if (!to) return;
  try {
    sessionStorage.setItem(`${NAV_STATE_PREFIX}${to}`, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
};

const readNavState = (asPath: string) => {
  if (typeof window === "undefined") return undefined;
  if (!asPath) return undefined;
  const keysToTry = [asPath, asPath.split("?")[0], asPath.split("#")[0]];
  for (const key of keysToTry) {
    const stored = sessionStorage.getItem(`${NAV_STATE_PREFIX}${key}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
};

export const Link = ({ to, href, state, children, onClick, ...props }: LinkProps) => {
  const finalHref = href ?? to ?? "#";
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (state) {
      storeNavState(finalHref, state);
    }
    if (onClick) {
      onClick(event);
    }
  };
  return (
    <NextLink href={finalHref} onClick={handleClick} {...props}>
      {children ?? <span />}
    </NextLink>
  );
};

export const useNavigate = () => {
  const router = useRouter();
  return (to: string | number, options?: NavigateOptions) => {
    if (typeof to === "number") {
      return router.back();
    }
    if (options?.state) {
      storeNavState(to, options.state);
    }
    if (options && options.replace) {
      return router.replace(to);
    }
    return router.push(to);
  };
};

export const useParams = () => {
  const router = useRouter();
  return router.query as Record<string, string | string[] | undefined>;
};

export const useLocation = () => {
  const router = useRouter();
  const asPath = router.asPath || "";

  return useMemo<LocationLike>(() => {
    const [path, hash] = asPath.split("#");
    const [pathname, search] = path.split("?");

    return {
      pathname: pathname || "/",
      search: search ? `?${search}` : "",
      hash: hash ? `#${hash}` : "",
      state: readNavState(asPath),
      key: "default",
    };
  }, [asPath]);
};

type NavigateProps = {
  to: string;
  replace?: boolean;
};

export const Navigate = ({ to, replace }: NavigateProps) => {
  const router = useRouter();

  useEffect(() => {
    if (!to) return;
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);

  return null;
};

export default Link;
