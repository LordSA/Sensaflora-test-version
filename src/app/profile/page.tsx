'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Order {
  id: string;
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>;
  total: number;
  status: 'placed' | 'packed' | 'shipped' | 'delivered';
  createdAt: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // TODO: Fetch orders from Firebase
    // For now, using mock data
    setOrders([
      {
        id: '1',
        items: [
          {
            id: 'product1',
            title: 'Gold Necklace',
            price: 25000,
            quantity: 1,
            imageUrl: '/products/necklace.jpg',
          },
        ],
        total: 25000,
        status: 'shipped',
        createdAt: new Date().toISOString(),
      },
    ]);
  }, [user, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || 'Profile'}
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl font-medium">
                {user.email?.[0].toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-serif">
                {user.displayName || 'Welcome'}
              </h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-serif mb-6">Order History</h2>

            {orders.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                You haven't placed any orders yet.
              </p>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Order #{order.id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{order.total.toLocaleString()}
                        </p>
                        <p className="text-sm text-primary capitalize">
                          {order.status}
                        </p>
                      </div>
                    </div>

                    {/* Order Progress */}
                    <div className="mb-6">
                      <div className="relative">
                        <div className="flex justify-between mb-2">
                          {['placed', 'packed', 'shipped', 'delivered'].map(
                            (step) => (
                              <span
                                key={step}
                                className={`text-sm capitalize ${
                                  order.status === step
                                    ? 'text-primary font-medium'
                                    : 'text-gray-500'
                                }`}
                              >
                                {step}
                              </span>
                            )
                          )}
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{
                              width:
                                ((['placed', 'packed', 'shipped', 'delivered'].indexOf(
                                  order.status
                                ) +
                                  1) /
                                  4) *
                                  100 +
                                '%',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4"
                        >
                          <div className="w-16 h-16 relative shrink-0">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            ₹{item.price.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}