const path = require("path");

module.exports = {
    context: __dirname,
    entry: {
        main:"./src/main.ts",
    },

    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/dist/"
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader"
                }
            },

            {
                test: /\.wgsl$/,
                use: {
                    loader: "ts-shader-loader"
                }
            }
        ]
    },

    resolve: {
        extensions: [".ts"]
    }

}