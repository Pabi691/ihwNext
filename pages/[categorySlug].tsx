import React from "react";
import type { GetServerSideProps } from "next";
import ProductPage from "@/components/pages/ProductPage";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slugParam = ctx.params?.categorySlug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  if (!slug) {
    return { notFound: true };
  }

  try {
    const token = process.env.NEXT_PUBLIC_WEB_TOKEN;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`,
      { headers }
    );

    if (!res.ok) {
      // Don't convert transient API/env failures into a hard 404.
      // Let client-side fetching render category data when available.
      return { props: {} };
    }

    const data = await res.json();
    const listRaw = data?.category_list ?? [];
    const list = Array.isArray(listRaw) ? listRaw : [listRaw];
    if (list.length === 0) {
      return { props: {} };
    }

    const allSlugs = new Set<string>();
    for (const cat of list) {
      if (cat?.slug) allSlugs.add(String(cat.slug).toLowerCase());
      if (Array.isArray(cat?.child_categories)) {
        for (const child of cat.child_categories) {
          if (child?.slug) allSlugs.add(String(child.slug).toLowerCase());
        }
      }
    }

    if (!allSlugs.has(String(slug).toLowerCase())) {
      return { notFound: true };
    }

    return { props: {} };
  } catch {
    return { props: {} };
  }
};

const CategoryPage = () => <ProductPage />;

export default CategoryPage;
