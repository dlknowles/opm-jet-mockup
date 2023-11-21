const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const files = {
    header: fs.readFileSync('./src/parts/header.html', { encoding: 'utf-8' }),
    footer: fs.readFileSync('./src/parts/footer.html', { encoding: 'utf-8' })
};

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html',
            templateParameters: {
                files
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/quiz.html',
            filename: './quiz.html',
            templateParameters: {
                files
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/quiz-old.html',
            filename: './quiz-old.html',
            templateParameters: {
                files
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/results.html',
            filename: './results.html',
            templateParameters: {
                files
            }
        })
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        compress: true,
        port: 9000
    }
};
