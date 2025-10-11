'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ui/product-card';
import { getProducts, Product } from '@/lib/products';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const category = searchParams.get('category');
  const sortBy = searchParams.get('sortBy') as 'price' | 'createdAt' || 'createdAt';
  const order = searchParams.get('order') as 'asc' | 'desc' || 'desc';

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const loadedProducts = await getProducts({
          category: category || undefined,
          sortBy,
          order,
        });
        setProducts(loadedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [category, sortBy, order]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif">Shop</h1>
        <div className="flex gap-4">
          {/* Add filter and sort controls here */}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}