'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const { state, updateQuantity, removeItem } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-serif mb-8">Shopping Cart</h1>
        <div className="text-center py-12">
          <h2 className="text-xl mb-4">Your cart is empty</h2>
          <Button asChild>
            <Link href="/shop">
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-serif mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {state.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 p-4 bg-white rounded-lg shadow"
              >
                <Link href={`/product/${item.id}`} className="shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />
                </Link>

                <div className="flex-grow">
                  <Link
                    href={`/product/${item.id}`}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {item.title}
                  </Link>
                  <p className="text-primary font-semibold mt-1">
                    ₹{item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      className="rounded-md border border-gray-200 py-1 px-2"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-serif">Order Summary</h2>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span>₹{state.total.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{state.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full">
              Proceed to Checkout
            </Button>

            <p className="text-sm text-gray-500 text-center">
              or{' '}
              <Link
                href="/shop"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Continue Shopping
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}