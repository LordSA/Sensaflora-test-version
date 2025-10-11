'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  if (state.items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // For demonstration, we'll just show a success message
      // In production, integrate with your backend and payment gateway
      await new Promise((resolve) => setTimeout(resolve, 2000));
      clearCart();
      toast.success('Order placed successfully!');
      router.push('/profile');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGooglePay = async () => {
    // This is a simplified example. In production, integrate with Google Pay API
    if ('PaymentRequest' in window) {
      const request = new PaymentRequest(
        [
          {
            supportedMethods: 'https://google.com/pay',
            data: {
              environment: 'TEST',
              apiVersion: 2,
              apiVersionMinor: 0,
              merchantInfo: {
                merchantId: '12345678901234567890',
                merchantName: 'Sensaflora',
              },
              allowedPaymentMethods: [
                {
                  type: 'CARD',
                  parameters: {
                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                    allowedCardNetworks: ['MASTERCARD', 'VISA'],
                  },
                  tokenizationSpecification: {
                    type: 'PAYMENT_GATEWAY',
                    parameters: {
                      gateway: 'example',
                      gatewayMerchantId: 'exampleGatewayMerchantId',
                    },
                  },
                },
              ],
              transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPrice: state.total.toString(),
                currencyCode: 'INR',
              },
            },
          },
        ],
        {
          total: {
            label: 'Total',
            amount: { currency: 'INR', value: state.total.toString() },
          },
        }
      );

      try {
        const response = await request.show();
        await response.complete('success');
        clearCart();
        toast.success('Payment successful!');
        router.push('/profile');
      } catch (error) {
        console.error('Payment error:', error);
        toast.error('Payment failed');
      }
    } else {
      toast.error('Google Pay is not supported in this browser');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-serif mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-serif mb-6">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />

            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              required
            />

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                className="block w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-dark placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
                required
              />

              <Input
                label="State"
                value={formData.state}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, state: e.target.value }))
                }
                required
              />
            </div>

            <Input
              label="PIN Code"
              value={formData.pincode}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, pincode: e.target.value }))
              }
              required
            />
          </form>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <h2 className="text-xl font-serif">Order Summary</h2>

            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="flex-1">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>₹{state.total.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{state.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleGooglePay}
                className="w-full"
                disabled={isProcessing}
              >
                <svg
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.367,1.719-1.341,3.237-2.818,4.256 c-1.476,1.019-3.318,1.414-5.11,1.098c-1.792-0.316-3.383-1.338-4.402-2.814C4.647,15.122,4.252,13.28,4.568,11.488 c0.316-1.792,1.338-3.383,2.814-4.402c1.476-1.019,3.318-1.414,5.11-1.098c1.144,0.202,2.186,0.725,3.057,1.484l2.158-2.158 c-1.327-1.327-3.058-2.185-4.915-2.449c-2.298-0.326-4.591,0.276-6.382,1.673C4.561,6.093,3.099,8.143,2.773,10.442 c-0.326,2.298,0.276,4.591,1.673,6.382c1.397,1.79,3.447,3.252,5.746,3.578c2.298,0.326,4.591-0.276,6.382-1.673 c1.79-1.397,3.252-3.447,3.578-5.746c0.068-0.479,0.103-0.964,0.103-1.45v-1.909h-7.719C12.545,10.242,12.545,12.151,12.545,12.151 z"></path>
                </svg>
                Pay with Google Pay
              </Button>

              <Button
                type="submit"
                variant="outline"
                className="w-full"
                disabled={isProcessing}
              >
                Pay with Cash on Delivery
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}