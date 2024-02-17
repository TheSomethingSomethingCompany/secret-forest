/** @type {import('next').NextConfig} */
const nextConfig = {
	basePath: "",
	async redirects() {
		return [
			{
				source: "/",
				destination: "/home",
				basePath: false,
				permanent: true,
			},
		];
	},
	
	// INTERNALLY RE-ROUTES A URL TO A DIFFERENT PATH WITHIN NEXT.JS WITHOUT UPDATING THE BROWSERS ADDRESS BAR.
	async rewrites() {
		return [
			{
				source: "/home",
				destination: "/",
			},
		];
	},
};

module.exports = nextConfig;
