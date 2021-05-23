// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const isProduction = process.env.NODE_ENV == 'production';
const stylesHandler = 'style-loader';

const config = {
    entry: {
        quillLocalDraft: ['./src/QuillLocalDraft.ts'],
        demo: ['./src/demo/demo.js', './src/demo/demo.css' , ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: (pathData) => {
            let prefix = '';
            if (pathData.chunk.name == 'demo')
                prefix = 'demo/'
            return prefix + pathData.chunk.name + '.js'
        }
    },
    devtool: 'inline-source-map',
    devServer: {
        open: true,
        host: 'localhost',
        contentBase: './dist',
        openPage: ['demo/demo.html'],
        writeToDisk: true,
    },    
    plugins: [
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
    } else {
        config.mode = 'development';
    }
    return config;
};
