import fs from "fs";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import pkg from "./package.json";

const banner = fs.readFileSync("src/banner.txt")
	.toString()
	.replace("%VERSION%", pkg.version);

export default [
	// browser-friendly UMD build
	{
		input: "src/main.ts",
		output: {
			name: "sico",
			file: pkg.browser,
			format: "umd",
			banner: banner.replace("%FILE%", pkg.browser),
			sourcemap: true
		},
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs() // so Rollup can convert `ms` to an ES module
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	{
		input: "src/main.js",
		external: ["ms"],
		output: [
			{
				format: "cjs",
				file: pkg.main,
				banner: banner.replace("%FILE%", pkg.main),
			},
			{
				format: "es",
				file: pkg.module,
				banner: banner.replace("%FILE%", pkg.module),
			}
		]
	}
];