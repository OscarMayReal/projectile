import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    transpilePackages: ["@projectile/shared"],
    rewrites: async () => {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:3001/:path*",
            },
        ]
    },
    allowedDevOrigins: ['oscar-macbook-dev-3000.quntem.co.uk']
}

export default nextConfig
