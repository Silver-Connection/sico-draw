import pkg from "./package.json";
import fs from "fs";
import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import uglify from "rollup-plugin-uglify";

import livereload from "rollup-plugin-livereload";
import serve from "rollup-plugin-serve";

const banner = fs.readFileSync("src/banner.txt")
	.toString()
	.replace("%VERSION%", pkg.version);

const pluginsCommon = [
	resolve(), // so Rollup can find `ms`
	// commonjs() // so Rollup can convert `ms` to an ES module
]

if (process.env.NODE_ENV === "production") {
	pluginsCommon.push(uglify())
} 

const pluginsUmd = pluginsCommon.concat([
	commonjs(),
	typescript({
		useTsconfigDeclarationDir: true,
	})
]);

const pluginsNode = pluginsCommon.concat([
	commonjs(),
	typescript({
		tsconfigOverride: {
			compilerOptions: {
				declaration: false,
			}
		}
	})
]);

if (process.env.NODE_ENV === "development") {
	pluginsUmd.push(livereload())
	pluginsUmd.push(serve({
		open: true,
		verbose: true,
		contentBase: ["./", "dist"]
	}))
}

export default [
	// browser-friendly UMD build
	{
		input: "src/main.ts",
		output: {
			name: "sico.draw",
			file: pkg.browser,
			format: "umd",
			banner: banner.replace("%FILE%", pkg.browser),
			sourcemap: true
		},
		plugins: pluginsUmd
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	{
		input: "src/main.ts",
		external: ["ms"],
		plugins: pluginsNode,
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