/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        unoptimized: true,
    },
    eslint: {
        // สั่งให้ Next.js ยอม Build ผ่านไปเลย ถึงแม้จะมี Error ของ ESLint ก็ตาม
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;