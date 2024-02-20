/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		PASS_HASH:
			"230e6fc32123b6164d3aaf26271bb1843c67193132c78137135d0d8f2160d1d3",
	},
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
