/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   experimental: {
      appDir: true,
   },
   async redirects() {
      return [
         {
            source: "/admin",
            destination: "/admin/dashboard",
            permanent: false,
         },
         {
            source: "/admin/dashboard",
            destination: "/admin/dashboard/users",
            permanent: false,
         },
      ];
   },
};

module.exports = nextConfig;
