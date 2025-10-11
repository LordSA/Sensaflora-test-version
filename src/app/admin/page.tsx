'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addProduct, updateProduct, deleteProduct, uploadProductImage } from '@/lib/products';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    imageFile: null as File | null,
    markdownContent: '',
  });
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    // Check if user is admin
    if (user?.email !== 'sensaflora@gmail.com') {
      router.push('/');
    }
  }, [user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = '';
      if (formData.imageFile) {
        imageUrl = await uploadProductImage(formData.imageFile);
      }

      await addProduct({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl,
        markdownContent: formData.markdownContent,
      });

      toast.success('Product added successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        imageFile: null,
        markdownContent: '',
      });
      setPreviewUrl('');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.email !== 'sensaflora@gmail.com') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-serif mb-8">Admin Panel</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-serif mb-6">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="block w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-dark placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                rows={3}
                required
              />
            </div>

            <Input
              label="Price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              required
            />

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="block w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-dark"
                required
              >
                <option value="">Select a category</option>
                <option value="necklaces">Necklaces</option>
                <option value="earrings">Earrings</option>
                <option value="rings">Rings</option>
                <option value="home-fragments">Home Fragments</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-light file:text-primary hover:file:bg-primary-light/80"
                required
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-4 w-40 h-40 object-cover rounded-md"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Markdown Description
              </label>
              <textarea
                value={formData.markdownContent}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    markdownContent: e.target.value,
                  }))
                }
                className="block w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-dark placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                rows={10}
                placeholder="# Product Details
- Feature 1
- Feature 2

## Care Instructions
..."
              />
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Add Product
            </Button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-serif mb-6">Markdown Preview</h2>
          <div className="prose prose-stone max-w-none p-6 bg-white rounded-lg shadow">
            <ReactMarkdown>{formData.markdownContent}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}