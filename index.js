#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function runCommand(command) {
  execSync(command, { stdio: "inherit" });
}

function createDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function createFile(filePath, content = "") {
  fs.writeFileSync(filePath, content, "utf8");
}

// 1. Create the directories
createDirectory("src");
createDirectory("public");
createDirectory("public/img");
createDirectory("styles");
createDirectory("dist");

// 2. Create the files
createFile(
  path.join("src", "App.jsx"),
  `import { LumaJS } from 'luma-js';

function App() {
	return (
		<div class="centered-div">
			<h2>Booted LumaJS</h2>
			<br/>
			<img src="public/img/luma-js.png" alt="" width="400" height="400" />
			<br />
			<br />
			<h3>Edit src/App.jsx and save to reload</h3>
		</div>
	);
}

LumaJS.render(<App />, document.querySelector('#root'));

`
);

createFile(
  "index.html",
  `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LumaJS App</title>
	<link rel="stylesheet" href="styles/App.css">
</head>
<body>
    <div id="root"></div>
    <script src="./dist/bundle.js"></script>
</body>
</html>
`
);

createFile(
  path.join("styles", "App.css"),
  `
	body {
			margin: 0; /* Remove default body margin */
			background: linear-gradient(to bottom, #0F1E4E, #295eb9);
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 100vh; /* Ensure the gradient covers the full viewport */
		}

		.centered-div {
			background: linear-gradient(to bottom,#007771, #00436a);
			color: white;
			padding: 20px;
			border-radius: 10px;
			text-align: center;
			animation: scaleAndFadeIn 1s ease;
		}

		@keyframes scaleAndFadeIn {
			0% { transform: scale(0.5); opacity: 0; }
			100% { transform: scale(1); opacity: 1; }
		}

		.centered-div h2, h3 {
			text-align: center; /* Center the text horizontally */
			margin: 0; /* Remove default margin for the paragraph */
			color: rgb(235, 235, 235);
		}

		.centered-div img {
			border-radius: 10px; /* Round the corners of the image */
			max-width: 100%; /* Ensure the image fits within the div */
			height: auto; /* Maintain the image's aspect ratio */
		}
	`
);

function copyLogo() {
  // Path to the logo.png within your package
  const sourcePath = path.join(__dirname, "assets", "luma-js.png");

  // Destination path in the new project
  const destPath = path.join("public/img", "luma-js.png");

  fs.copyFileSync(sourcePath, destPath);
}

copyLogo();

createFile(
  "luma-bundler.js",
  `
const esbuild = require('esbuild');
const chokidar = require('chokidar');
const liveServer = require('live-server');

// Function to bundle with esbuild
function bundle() {
    esbuild.build({
        entryPoints: ['src/App.jsx'],
        bundle: true,
        outfile: 'dist/bundle.js',
        loader: { '.js': 'jsx' },
        jsxFactory: 'LumaJS.createElement',
        jsxFragment: 'LumaJS.Fragment'
    }).catch(() => process.exit(1));
}

// Initial build
bundle();

// Watch for changes
chokidar.watch('src/**/*').on('change', bundle);

// Serve with live-server
liveServer.start({
    root: '.',
    open: false,
    wait: 200 // Wait for all changes, before reloading.
});
`
);

// 3. Install the packages
runCommand("npm init -y");
runCommand("npm install chokidar esbuild live-server luma-js");

console.log(
  "Your LumaJS project has been set up! To start, run `node luma-bundler.js`."
);
