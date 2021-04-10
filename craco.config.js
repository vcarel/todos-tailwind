/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable sort-keys-fix/sort-keys-fix */
const CracoAlias = require("craco-alias")

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        baseUrl: "./src",
        source: "tsconfig",
        tsConfigPath: "./tsconfig.paths.json",
      },
    },
  ],
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
}
