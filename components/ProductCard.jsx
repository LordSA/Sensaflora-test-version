import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <Image
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
          width={300}
          height={300}
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm text-gray-700">
          <Link href={`/product/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
        <button
          onClick={() => addToCart(product)}
          className="mt-4 w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}