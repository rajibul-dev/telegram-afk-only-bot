const path = require("path");

module.exports = {
  mode: "development", // Change to "production" for production build
  entry: "./functions/index.js", // Entry point for your application
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "bundle.js" // Output file name
  },
  resolve: {
    extensions: [".js"] // Allow importing .js files without extension
  },
  target: "node", // Build for Node.js environment
  watch: true // Enable watch mode
};
