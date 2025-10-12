/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'], // Allow loading images from Firebase Storage
  }
}

module.exports = nextConfig