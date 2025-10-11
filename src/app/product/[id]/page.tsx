'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getProduct, Product } from '@/lib/products';
import { useCart } from '@/lib/cart-context';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const loadedProduct = await getProduct(id as string);
        setProduct(loadedProduct);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast.success('Added to cart!');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 aspect-square bg-gray-100 rounded-lg animate-pulse" />
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
            <div className="h-6 bg-gray-100 rounded w-24 animate-pulse" />
            <div className="h-32 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-serif">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/2">
          <div className="relative aspect-square">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-3xl md:text-4xl font-serif">{product.title}</h1>
          <p className="text-2xl font-semibold text-primary">
            ₹{product.price.toLocaleString()}
          </p>

          <div className="prose prose-stone max-w-none">
            {product.markdownContent ? (
              <ReactMarkdown>{product.markdownContent}</ReactMarkdown>
            ) : (
              <p>{product.description}</p>
            )}
          </div>

          <div className="pt-6 space-y-4">
            <Button
              size="lg"
              className="w-full md:w-auto"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full md:w-auto"
              onClick={handleAddToCart}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}