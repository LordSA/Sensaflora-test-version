'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { getUserOrders } from '@/lib/firestore';

const ORDER_STATUS_STEPS = [
  { id: 'placed', label: 'Order Placed', icon: Package },
  { id: 'packed', label: 'Packed', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      const data = await getUserOrders(user.uid);
      setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, [user, router]);

  const getStatusStep = (status) => {
    return ORDER_STATUS_STEPS.findIndex((step) => step.id === status);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-cream min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-serif text-primary mb-8">My Profile</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center mb-4">
                  <User size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-primary">
                  {user.displayName || 'Guest User'}
                </h2>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-cream rounded-lg">
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-semibold">
                    {user.metadata?.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                        })
                      : 'Recently'}
                  </p>
                </div>
                <div className="p-3 bg-cream rounded-lg">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="font-semibold">{orders.length}</p>
                </div>
              </div>

              <button className="w-full mt-6 bg-primary text-cream py-3 rounded-lg hover:bg-dark transition">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-serif text-primary mb-6">Order History</h2>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-32 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-xl text-gray-600 mb-4">No orders yet</p>
                  <button
                    onClick={() => router.push('/shop')}
                    className="bg-gold text-white px-6 py-3 rounded-lg hover:bg-gold-light transition"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => {
                    const currentStep = getStatusStep(order.status || 'placed');

                    return (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                          <div>
                            <p className="font-semibold text-primary">
                              Order #{order.id.substring(0, 12)}...
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right mt-2 sm:mt-0">
                            <p className="font-bold text-gold text-xl">₹{order.total}</p>
                            <p className="text-sm text-gray-600">
                              {order.items?.length || 0} item(s)
                            </p>
                          </div>
                        </div>

                        {/* Order Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between relative">
                            {/* Progress Line */}
                            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                              <div
                                className="h-full bg-gold transition-all duration-500"
                                style={{
                                  width: `${(currentStep / (ORDER_STATUS_STEPS.length - 1)) * 100}%`,
                                }}
                              ></div>
                            </div>

                            {/* Status Steps */}
                            {ORDER_STATUS_STEPS.map((step, index) => {
                              const Icon = step.icon;
                              const isActive = index <= currentStep;
                              const isCurrent = index === currentStep;

                              return (
                                <div
                                  key={step.id}
                                  className="flex flex-col items-center relative z-10"
                                >
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                      isActive
                                        ? 'bg-gold text-white'
                                        : 'bg-gray-200 text-gray-400'
                                    } ${isCurrent ? 'ring-4 ring-gold/30' : ''}`}
                                  >
                                    <Icon size={20} />
                                  </div>
                                  <p
                                    className={`text-xs mt-2 text-center max-w-[80px] ${
                                      isActive ? 'text-primary font-semibold' : 'text-gray-500'
                                    }`}
                                  >
                                    {step.label}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Items:</p>
                          <div className="space-y-2">
                            {order.items?.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {item.name} x{item.quantity}
                                </span>
                                <span className="font-semibold">
                                  ₹{item.price * item.quantity}
                                </span>
                              </div>
                            ))}
                            {order.items?.length > 3 && (
                              <p className="text-sm text-gray-500">
                                +{order.items.length - 3} more item(s)
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Shipping Address */}
                        {order.shippingAddress && (
                          <div className="border-t border-gray-200 pt-4 mt-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                              Shipping Address:
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.fullName}
                              <br />
                              {order.shippingAddress.address}
                              <br />
                              {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                              {order.shippingAddress.pincode}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}