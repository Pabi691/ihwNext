import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from '@/components/compat/router';
import ProductPageBody from '@/components/ProductPageBody';
import MainLayOut from '@/layout/MainLayOut';
import MobileMainLayout from '@/layout/MobileMainLayout';
import axios from 'axios';
import { useGlobal } from '@/global/GlobalContext';
import NotFound from '@/components/common/NotFound';
import TryAgainButton from '@/components/common/TryAgainButton';
import { ProductService } from '@/content/product-service';

type ProductPageProps = {
  showAll?: boolean;
};

function ProductPage({ showAll }: ProductPageProps) {
  const { categorySlug } = useParams();
  const [productLength, setProductLength] = useState<number>(0);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [catagoryProducts, setCatagoryProducts] = useState<any[]>([]);
  const { token, products: globalProducts } = useGlobal();
  const navigate = useNavigate();
  const lastFetchKeyRef = useRef<string | null>(null);
  const inFlightRef = useRef(false);

  const fetchProducts = useCallback(async () => {
    const slug = Array.isArray(categorySlug) ? categorySlug[0] : categorySlug;
    const fetchKey = `${slug || 'all'}:${token || ''}`;
    if (inFlightRef.current || lastFetchKeyRef.current === fetchKey) return;
    inFlightRef.current = true;
    setLoading(true);

    // If we already have global products, reuse them on Shop page
    if (!slug && showAll && Array.isArray(globalProducts) && globalProducts.length > 0) {
      setProductLength(globalProducts.length);
      setProducts({ products: globalProducts } as any);
      setLoading(false);
      inFlightRef.current = false;
      lastFetchKeyRef.current = fetchKey;
      return;
    }

    try {
      if (slug && slug !== 'categories') {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_slug_data/${slug}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data.status) {
          const dataProducts = response.data;
          setProductLength(dataProducts.total_products);
          setCatagoryProducts(dataProducts);
        } else {
          navigate('/404');
        }
      } else {
        const response = await ProductService.getAll();
        setProductLength(response.data.products.length);
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Product fetch error:", error);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
      lastFetchKeyRef.current = fetchKey;
    }
  }, [categorySlug, token, showAll, globalProducts, setCatagoryProducts, setProducts, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const safeTitle =
  showAll
    ? 'All Products'
    : typeof categorySlug === 'object'
      ? (categorySlug as any)?.title
      : categorySlug;

  // Show a loading indicator before the data is available
  if (loading) {
    return (
      <TryAgainButton />
    );
  }
  if (!products) {
    return (
      <NotFound />
    )
  }
  return (
    <>
      <div className='hidden md:block'>
        <MainLayOut>
          {(catagoryProducts || products) && (
            <ProductPageBody products={products} catagoryProducts={catagoryProducts} categorySlug={showAll ? null : categorySlug} />
          )}

        </MainLayOut>
      </div>
      <div className='md:hidden'>
        <MobileMainLayout ProductsCount={`${productLength} products`} title={safeTitle}>
          {(catagoryProducts || products) && (
            <ProductPageBody products={products} catagoryProducts={catagoryProducts} categorySlug={showAll ? null : categorySlug} />
          )}
        </MobileMainLayout>
      </div>

    </>
  )
}

export default ProductPage;


