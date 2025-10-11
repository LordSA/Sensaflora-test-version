import Image from 'next/image';
import Link from 'next/link';
import { Button } from './button';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
}

export function ProductCard({ id, title, price, imageUrl, category }: ProductCardProps) {
  return (
    <div className="group relative">
      <Link href={`/product/${id}`} className="block aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={imageUrl}
          alt={title}
          width={500}
          height={500}
          className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
        />
      </Link>
      <div className="mt-4 space-y-1">
        <p className="text-sm text-gray-500 capitalize">{category}</p>
        <Link href={`/product/${id}`} className="block">
          <h3 className="text-lg font-medium text-dark hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-lg font-semibold text-primary">₹{price.toLocaleString()}</p>
        <Button variant="outline" size="sm" className="w-full mt-2">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}