/** @type {import('next').NextConfig} */

function getUploadRemotePatterns() {
  const patterns = [
    {
      protocol: "http",
      hostname: "localhost",
      port: "5000",
      pathname: "/uploads/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      port: "5001",
      pathname: "/uploads/**",
    },
  ];

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    try {
      const { protocol, hostname, port } = new URL(apiUrl);
      patterns.push({
        protocol: protocol.replace(":", ""),
        hostname,
        ...(port ? { port } : {}),
        pathname: "/uploads/**",
      });
    } catch {
      // ignore invalid URL at build time
    }
  }

  return patterns;
}

const nextConfig = {
  transpilePackages: ["motion", "framer-motion", "motion-dom", "motion-utils"],
  experimental: {
    optimizePackageImports: ["motion", "lucide-react"],
  },
  images: {
    remotePatterns: getUploadRemotePatterns(),
  },
};

export default nextConfig;
