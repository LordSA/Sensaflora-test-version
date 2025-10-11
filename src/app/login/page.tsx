'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn, signInWithGoogle } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast.success('Successfully logged in!');
      router.push('/');
    } catch (error) {
      toast.error('Invalid email or password');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success('Successfully logged in with Google!');
      router.push('/');
    } catch (error) {
      toast.error('Failed to login with Google');
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Sensaflora"
            width={180}
            height={48}
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-3xl font-serif text-dark">Sign in to your account</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign in
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.367,1.719-1.341,3.237-2.818,4.256 c-1.476,1.019-3.318,1.414-5.11,1.098c-1.792-0.316-3.383-1.338-4.402-2.814C4.647,15.122,4.252,13.28,4.568,11.488 c0.316-1.792,1.338-3.383,2.814-4.402c1.476-1.019,3.318-1.414,5.11-1.098c1.144,0.202,2.186,0.725,3.057,1.484l2.158-2.158 c-1.327-1.327-3.058-2.185-4.915-2.449c-2.298-0.326-4.591,0.276-6.382,1.673C4.561,6.093,3.099,8.143,2.773,10.442 c-0.326,2.298,0.276,4.591,1.673,6.382c1.397,1.79,3.447,3.252,5.746,3.578c2.298,0.326,4.591-0.276,6.382-1.673 c1.79-1.397,3.252-3.447,3.578-5.746c0.068-0.479,0.103-0.964,0.103-1.45v-1.909h-7.719C12.545,10.242,12.545,12.151,12.545,12.151 z"></path>
              </svg>
              Sign in with Google
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}