const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.ts',
    admin: './src/components/admin-panel/admin-panel.ts',
    auth: './src/components/auth/auth.ts',
    blogpost: './src/components/blog-post/blog-post.ts',
    about: './src/components/about/about.ts',
    contact: './src/components/contact/contact.ts',
    redirect: './src/components/redirect/redirect.ts',
  },
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    index: 'index.html',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'Blog SEO',
      template: './src/template.html',
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'admin-panel.html',
      template: './src/components/admin-panel/admin-panel.html',
      chunks: ['admin'],
    }),
    new HtmlWebpackPlugin({
      filename: 'auth.html',
      template: './src/components/auth/auth.html',
      chunks: ['auth'],
    }),
    new HtmlWebpackPlugin({
      filename: 'blog-post.html',
      template: './src/components/blog-post/blog-post.html',
      chunks: ['blogpost'],
    }),
    new HtmlWebpackPlugin({
      filename: 'about.html',
      template: './src/components/about/about.html',
      chunks: ['about'],
    }),
    new HtmlWebpackPlugin({
      filename: 'contact.html',
      template: './src/components/contact/contact.html',
      chunks: ['contact'],
    }),
    new HtmlWebpackPlugin({
      filename: 'redirect.html',
      template: './src/components/redirect/redirect.html',
      chunks: ['redirect'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.html$/i,
        loader: ['html-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
};
