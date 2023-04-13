/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require("next-transpile-modules")([
  "@incmix/theme",
  "@incmix/utils",
  "@incmix/is-json-schema-subset",
  "@incmix/builder-ui",
  "@incmix/ui",
  "@incmix/pro",
  "@incmix/calendar",
  "@react-google-maps/api",
  "swagger-ui-react",
  "@chakra-ui/hooks",
  "@chakra-ui/icon",
  "@chakra-ui/icons",
  "@chakra-ui/layout",
  "@chakra-ui/transition",
  "@chakra-ui/react",
  "@chakra-ui/system",
]);
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})({});
/** @type {import("next").NextConfig} */
const nextConfig = {
  ...withTM(),
  // withBundleAnalyzer,
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
