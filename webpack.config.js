const path = require('path');

const HTMLWebPackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  // Де лежать сорс коди. При вказування шляху до файлів ./src можна не писати
  context: path.resolve(__dirname, 'src'),
  // Мод в якому буде відбуватись білд. [production, development]
  // production зробить мінівізований js файл. Development ні
  mode: "development",
  // Всі ключі будуть перетворенні в [name] для output {foo: './bar'} -> [name].js -> foo.js
  entry: {
    main: './index.js'
  },
  output: {
    // файли які будуть включені в білд.
    // [name] береться з entry по ключах, [contenthash] -> hash контену. Міняється при зміні констексту файлу
    filename: "[name].[contenthash].js",
    // Куди білдити
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    // Виносить дубльований код в окремі файли
    splitChunks: {
      chunks: "all"
    }
  },
  devServer: {
    // Зробить сервер який буде автоматом підтягувтаи код. Аналог англуяра. Тримає весь код в опертивці
    // Для роботи треба прописати в package.json скрпт який використовує dev-server
    port: 4200
  },
  resolve: {
    alias: {
      // Дозволяє не імпортувати файли ../../../../assets/file.js, а просто @assets/file.js
      '@assets': path.resolve(__dirname, 'src/assets')
    }
  },
  plugins: [
    new HTMLWebPackPlugin({
      // Вказує на файл який буде братись в якості точки входу HTML. Копіює його з src в dist
      template: "./index.html"
    }),
    // Агалог rimraf для webpack
    new CleanWebpackPlugin({})
  ],
  module: {
    rules: [
      {
        // Коли webpack бачить .css, то використовує правила з use
        test: '/\.css$/',
        use: ['style-loader','css-loader'] // порядок важливий.
      },
      {
        test: '/\.(png|jpg|jpeg|svg|gif)$/',
        use: ['file-loader']
      },
      {
        test: '/\.(ttf|woff|woff2|eot)$/',
        use: ['file-loader']
      }
    ]
  }
};
