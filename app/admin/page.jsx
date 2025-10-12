'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/firestore';
import { uploadProductImage } from '@/lib/storage';

export default function AdminPanel() {
  const router = useRouter();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'necklaces',
    price: '',
    description: '',
    imageUrl: '',
    inStock: true,
    rating: 5.0,
  });

  const [imageFile, setImageFile] = useState(null);

  // Check if user is admin
  useEffect(() => {
    if (user && user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = formData.imageUrl;

    // Upload image if file is selected
    if (imageFile) {
      const tempId = editingProduct?.id || Date.now().toString();
      const { url, error } = await uploadProductImage(imageFile, tempId);
      if (error) {
        alert('Error uploading image: ' + error);
        return;
      }
      imageUrl = url;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      rating: parseFloat(formData.rating),
      imageUrl,
    };

    if (editingProduct) {
      // Update existing product
      const { error } = await updateProduct(editingProduct.id, productData);
      if (error) {
        alert('Error updating product: ' + error);
      } else {
        alert('Product updated successfully!');
        fetchProducts();
        resetForm();
      }
    } else {
      // Add new product
      const { id, error } = await addProduct(productData);
      if (error) {
        alert('Error adding product: ' + error);
      } else {
        alert('Product added successfully!');
        fetchProducts();
        resetForm();
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      imageUrl: product.imageUrl || '',
      inStock: product.inStock,
      rating: product.rating || 5.0,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const { error } = await deleteProduct(id);
      if (error) {
        alert('Error deleting product: ' + error);
      } else {
        alert('Product deleted successfully!');
        fetchProducts();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'necklaces',
      price: '',
      description: '',
      imageUrl: '',
      inStock: true,
      rating: 5.0,
    });
    setImageFile(null);
    setEditingProduct(null);
    setShowForm(false);
  };

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return (
      <div className="bg-cream min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif text-primary mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif text-primary">Admin Panel</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gold text-white px-6 py-3 rounded-lg hover:bg-gold-light transition flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-serif text-primary mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  >
                    <option value="necklaces">Necklaces</option>
                    <option value="earrings">Earrings</option>
                    <option value="rings">Rings</option>
                    <option value="fragments">Fragments</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    In Stock
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-gold rounded border-gray-300 focus:ring-gold"
                    />
                    <span className="text-gray-700">Product is in stock</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                  />
                  {(imageFile || formData.imageUrl) && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Preview:</p>
                      <Image
                        src={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description (Markdown)
                  </label>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold font-mono"
                        placeholder="# Product Features&#10;- Feature 1&#10;- Feature 2&#10;&#10;## Care Instructions&#10;..."
                      />
                    </div>
                    <div>
                      <div className="p-4 border border-gray-300 rounded-lg h-64 overflow-y-auto prose prose-sm">
                        <ReactMarkdown>{formData.description}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center space-x-4">
                <button
                  type="submit"
                  className="bg-gold text-white px-8 py-3 rounded-lg hover:bg-gold-light transition"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-600 hover:text-gray-800 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-serif text-primary mb-6">Products</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No products found.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-6 p-4 border border-gray-200 rounded-lg"
                  >
                    {product.imageUrl && (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-grow">
                      <h3 className="font-medium text-lg text-primary">{product.name}</h3>
                      <p className="text-gray-600">
                        {product.category} • ₹{product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-gray-600 hover:text-gold transition"
                        title="Edit"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-gray-600 hover:text-red-500 transition"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
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