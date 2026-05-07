/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    eslint: {
        // สั่งให้ Next.js ยอม Build ผ่านไปเลย ถึงแม้จะมี Error ของ ESLint ก็ตาม
        ignoreDuringBuilds: true,
    }, // <-- ต้องมีปีกกาปิดของ eslint ตรงนี้ด้วยครับ
};

export default nextConfig;