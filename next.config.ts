import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: ["@next-auth/prisma-adapter"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
		],
	},
	outputFileTracingIncludes: {
		"/**": ["./node_modules/.prisma/client/**"],
	},
};

export default nextConfig;
