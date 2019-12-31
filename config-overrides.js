const {
  override,
  fixBabelImports,
  addWebpackAlias,
  addWebpackModuleRule,
  setWebpackPublicPath
} = require("customize-cra")

const path = require("path")

const publicPath = process.env.NODE_ENV === "production" ? "/occa_analysis/" : "/"

module.exports = override(
  setWebpackPublicPath(publicPath),
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: "css"
  }),
  addWebpackAlias({
    "@": path.resolve(__dirname, "src/")
  }),
  addWebpackModuleRule({
    test: /\.svg$/,
    loader: "svg-sprite-loader",
    include: [path.resolve(__dirname, "src/icons")],
    options: {
      symbolId: "icon-[name]"
    }
  })
)
