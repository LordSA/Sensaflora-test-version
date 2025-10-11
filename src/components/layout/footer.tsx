import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-dark text-primary-light">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Image src="/logo.png" alt="Sensaflora" width={150} height={40} className="h-10 w-auto" />
            <p className="text-sm">
              Elegant ornaments and fragments that tell stories of beauty and tradition.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="hover:text-primary transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:sensaflora@gmail.com" className="hover:text-primary transition-colors">
                  sensaflora@gmail.com
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/share/16j9vfFi48/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/sensaflora.online" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-brown/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© {new Date().getFullYear()} Sensaflora. All rights reserved.</p>
          <a
            href="https://instagram.com/__shibiliii._"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-primary transition-colors mt-4 md:mt-0"
          >
            Developed by: Shibili Designs
          </a>
        </div>
      </div>
    </footer>
  );
}