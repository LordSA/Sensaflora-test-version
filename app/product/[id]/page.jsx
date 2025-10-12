'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'link';
import { Star, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import { getProductById } from '@/lib/firestore';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (params.id) {
        const data = await getProductById(params.id);
        setProduct(data);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert('Added to cart successfully!');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      router.push('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="bg-cream min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-300 rounded mb-8"></div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-300 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-300 rounded"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-24 bg-gray-300 rounded"></div>
                <div className="h-16 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-cream min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center py-16">
          <h2 className="text-3xl font-serif text-primary mb-4">Product Not Found</h2>
          <Link href="/shop" className="text-gold hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gold hover:text-gold-light transition mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-2xl p-8 shadow-xl">
          {/* Product Image */}
          <div className="relative rounded-xl overflow-hidden aspect-square">
            <Image
              src={product.imageUrl || product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition ${
                isLiked
                  ? 'bg-gold text-white'
                  : 'bg-white/90 text-primary hover:bg-gold hover:text-white'
              }`}
            >
              <Heart size={24} className={isLiked ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-serif text-primary mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className={
                    i < Math.floor(product.rating || 0)
                      ? 'fill-gold text-gold'
                      : 'text-gray-300'
                  }
                />
              ))}
              <span className="ml-3 text-lg text-gray-600">
                ({product.rating ? product.rating.toFixed(1) : 'New'})
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Category */}
            <div className="mb-6">
              <span className="inline-block bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold capitalize">
                {product.category}
              </span>
            </div>

            {/* Price */}
            <div className="text-5xl font-bold text-gold mb-8">₹{product.price}</div>

            {/* Stock Status */}
            {product.inStock ? (
              <div className="flex items-center space-x-2 mb-6 text-green-600">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="font-semibold">In Stock</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 mb-6 text-red-600">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="font-semibold">Out of Stock</span>
              </div>
            )}

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-gray-700 font-semibold">Quantity:</span>
                <div className="flex items-center border-2 border-gold rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-cream transition"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x-2 border-gold font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-cream transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center space-x-2 bg-white border-2 border-gold text-gold px-8 py-4 rounded-lg font-semibold hover:bg-cream transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 bg-gold text-white px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-primary mb-4">Product Details</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Handcrafted with premium materials</li>
                <li>• Free shipping on orders above ₹999</li>
                <li>• Easy returns within 7 days</li>
                <li>• Secure payment with Google Pay</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}