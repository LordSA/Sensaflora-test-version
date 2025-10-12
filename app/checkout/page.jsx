'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, CreditCard } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { createOrder } from '@/lib/firestore';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const shippingCost = cartTotal >= 999 ? 0 : 50;
  const finalTotal = cartTotal + shippingCost;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Validate form
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    const isValid = requiredFields.every(field => formData[field].trim() !== '');

    if (!isValid) {
      alert('Please fill in all required fields');
      setProcessing(false);
      return;
    }

    // Simulate payment processing
    setTimeout(async () => {
      // Create order in Firestore
      if (user) {
        await createOrder(user.uid, {
          items: cart,
          total: finalTotal,
          shippingAddress: formData,
          paymentMethod: 'Google Pay',
        });
      }

      setOrderPlaced(true);
      clearCart();
      setProcessing(false);

      // Redirect to profile after 3 seconds
      setTimeout(() => {
        router.push('/profile');
      }, 3000);
    }, 2000);
  };

  if (cart.length === 0 && !orderPlaced) {
    router.push('/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="bg-cream min-h-screen pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg p-12 text-center shadow-xl">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-3xl font-serif text-primary mb-4">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-2">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Redirecting to your profile...
            </p>
            <div className="w-16 h-1 bg-gold rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-serif text-primary mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-serif text-primary mb-6">
                Shipping Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-serif text-primary mb-4">Payment Method</h3>
                <div className="bg-gold/10 border-2 border-gold rounded-lg p-4 flex items-center space-x-4">
                  <CreditCard size={32} className="text-gold" />
                  <div>
                    <p className="font-semibold text-primary">Google Pay (UPI)</p>
                    <p className="text-sm text-gray-600">Secure payment via UPI</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full mt-8 bg-gold text-white px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : `Pay ₹${finalTotal}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-serif text-primary mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.imageUrl || item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gold">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold text-primary pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-gold">₹{finalTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}