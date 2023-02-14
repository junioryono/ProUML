/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   experimental: {
      esmExternals: "loose",
      fontLoaders: [{ loader: "@next/font/google", options: { subsets: ["latin"] } }],
   },
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "refactoring.guru",
            port: "",
            pathname: "/images/**",
         },
      ],
   },
   async redirects() {
      return [
         {
            source: "/dashboard",
            destination: "/dashboard/diagrams",
            permanent: false,
         },
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
