/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        ADMIN_PASS_KEY: process.env.ADMIN_PASS_KEY,
    },
};

export default nextConfig;
