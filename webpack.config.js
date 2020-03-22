const path = require('path');

const HTMLWebPackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebPackPlugin = require('copy-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebPuckPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

// [name] береться з entry по ключах, [hash] -> hash файлу
const filename = (ext) => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const optimization = () => {
  const config = {
    // Виносить дубльований код в окремі файли
    splitChunks: {
      chunks: "all"
    }
  };

  if (!isDev) {
    // Мініфікує HTML та CSS
    config.minimizer = [
      new OptimizeCSSAssetsPlugin(),
      new TerserWebPuckPlugin
    ]
  }
  return config;
};

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
    filename: filename('js'),
    // Куди білдити
    path: path.resolve(__dirname, 'dist')
  },
  optimization: optimization(),
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
      template: "./index.html",
      minify: {
        // Стрирає всі лишні пробіли в html
        collapseWhitespace: !isDev
      }
    }),
    // Агалог rimraf для webpack
    new CleanWebpackPlugin({}),
    // Плагін для копіювання файлів або папок. Переносить з однієї папки в іншу.
    // Можна використовувати на файли або папки
    new CopyWebPackPlugin([
      {
        from: path.resolve(__dirname, 'src/favicon.ico'),
        to: path.resolve(__dirname, 'dist')
      }
    ]),
    new MiniCSSExtractPlugin({
      filename: filename('css'),
    })
  ],
  module: {
    rules: [
      {
        // Якщо файли закінчуються на .css то я виконристовую такі правила.
        test: '/\.css$/',
        use: [
          {
            loader: MiniCSSExtractPlugin.loader,
            options: {
              hmr: isDev, // Hot Module Replacement. Перезавантажує стилі після зміни
              reloadAll: true
            }
          },
          'css-loader'
        ] // порядок важливий.
      },
      {
        test: '/\.sass/',
        use: [
          {
            loader: MiniCSSExtractPlugin.loader,
            options: {
              hmr: isDev, // Hot Module Replacement. Перезавантажує стилі після зміни
              reloadAll: true
            }
          },
          'css-loader',
          'sass-loader'
        ] // порядок важливий.
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
