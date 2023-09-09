const path = require("path");

module.exports = {
    context: __dirname,
    entry: {
        mainPageGpuInfo: "./src/scripts/mainPageGpuInfo/main.ts",
        simpleTriangle:"./src/scripts/simpleTriangle/main.ts",
        cubeIndexBuffer: "./src/scripts/cubeIndexBuffer/main.ts",
        googleFirstWebGpu: "./src/scripts/googleFirstWebGpu/main.ts"
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
    },

    experiments: {
        topLevelAwait: true
    }

}