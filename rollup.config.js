import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import replace from "rollup-plugin-replace";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

const GLOBALS = {
	"draft-js": "draftJs",
};
const OUTPUT_NAME = "createListPlugin";

if (!process.env.NODE_ENV) {
	throw Error("NODE_ENV environment variable is not defined");
}

export default [
	// Library
	{
		input: "./src/index.ts",
		output: [
			// UMD
			{
				file: pkg.main,
				format: "umd",
				name: OUTPUT_NAME,
				globals: GLOBALS,
			},
			// ES module
			{
				file: pkg.module,
				format: "esm",
				globals: GLOBALS,
			},
		],
		external: Object.keys(GLOBALS),
		plugins: [
			typescript({
				tsconfigOverride: {
					compilerOptions: {
						declaration: true,
						declarationMap: true,
					},
					include: ["./src/**/*"],
				},
			}),
		],
	},

	// Demo
	{
		input: "./demo/src/index.tsx",
		output: {
			file: "./demo/public/index.js",
			format: "cjs",
		},
		plugins: [
			// Include NPM dependencies in the bundle
			resolve(),
			commonjs({
				include: ["node_modules/**"],
				namedExports: {
					"./node_modules/react/index.js": ["Component"],
					"./node_modules/draft-js/lib/Draft.js": [
						"EditorState",
						"getDefaultKeyBinding",
						"Modifier",
						"RichUtils",
						"SelectionState",
					],
				},
			}),
			typescript(),
			replace({ "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV) }),
			postcss(),
		],
	},
];
