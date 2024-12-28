import { generateEntityMap } from "@/utils/FileUtils";
import type { NextConfig } from "next";

const nextConfig: () => Promise<NextConfig> = async () => {
  generateEntityMap();

  return {
    reactStrictMode: true,
  };
};

export default nextConfig;
