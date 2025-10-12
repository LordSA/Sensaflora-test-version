'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, X, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <div className="bg-cream min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-serif text-primary mb-8">Shopping Cart</h1>
          <div className="bg-white rounded-lg p-12 text-center shadow-lg">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
            <Link
              href="/shop"
              className="inline-block bg-gold text-white px-8 py-3 rounded-lg hover:bg-gold-light transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-serif text-primary mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-6"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={item.imageUrl || item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-primary text-lg mb-1">
                    {item.name}
                  </h3>
                  <p className="text-gold font-bold text-lg">₹{item.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border-2 border-gold rounded-lg hover:bg-cream transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border-2 border-gold rounded-lg hover:bg-cream transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right w-24">
                  <p className="font-bold text-primary">
                    ₹{item.price * item.quantity}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-serif text-primary mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">
                    {cartTotal >= 999 ? 'FREE' : '₹50'}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-primary">
                    <span>Total</span>
                    <span className="text-gold">
                      ₹{cartTotal >= 999 ? cartTotal : cartTotal + 50}
                    </span>
                  </div>
                </div>
              </div>

              {cartTotal < 999 && (
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-3 mb-6">
                  <p className="text-sm text-gray-700">
                    Add ₹{999 - cartTotal} more to get FREE shipping!
                  </p>
                </div>
              )}

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-gold text-white px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={20} />
              </button>

              <Link
                href="/shop"
                className="block text-center text-gold hover:text-gold-light transition mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}