const withSvgr = require("next-svgr");

module.exports = withSvgr({
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
});
