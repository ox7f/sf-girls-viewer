import { generateEntityMap } from "@/utils/FileUtils";
import type { NextConfig } from "next";

const nextConfig: () => Promise<NextConfig> = async () => {
  await generateEntityMap();

  return {
    reactStrictMode: true,
  };
};

export default nextConfig;
