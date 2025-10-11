import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.jpg"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            Discover Timeless Elegance
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Explore our curated collection of exquisite ornaments and fragments that tell stories of beauty and tradition.
          </p>
          <Link href="/shop">
            <Button size="lg">
              Shop Collection
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/shop?category=${category.slug}`}
                className="group relative aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white font-serif text-2xl">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">
            Featured Collection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Featured products will be loaded here */}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">
              Our Story
            </h2>
            <p className="text-lg mb-8">
              At Sensaflora, we believe in the power of beautiful ornaments to transform spaces and create lasting memories. Each piece in our collection is carefully curated to bring elegance and character to your home.
            </p>
            <Link href="/about">
              <Button variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
          <div className="flex-1 relative aspect-square">
            <Image
              src="/about-image.jpg"
              alt="About Sensaflora"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

const categories = [
  {
    name: 'Necklaces',
    slug: 'necklaces',
    image: '/categories/necklaces.jpg',
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    image: '/categories/earrings.jpg',
  },
  {
    name: 'Home Fragments',
    slug: 'home-fragments',
    image: '/categories/home-fragments.jpg',
  },
];
}
