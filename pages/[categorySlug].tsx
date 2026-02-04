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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_WEB_TOKEN ?? ""}`,
        },
      }
    );

    if (!res.ok) {
      return { notFound: true };
    }

    const data = await res.json();
    const listRaw = data?.category_list ?? [];
    const list = Array.isArray(listRaw) ? listRaw : [listRaw];
    if (list.length === 0) {
      return { notFound: true };
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
    return { notFound: true };
  }
};

const CategoryPage = () => <ProductPage />;

export default CategoryPage;
