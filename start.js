const express = require("express"),
	compile = require("./lib/better-template-literal");

const fs = require("fs");

const app = express();

app.set("views", "views");
app.use(express.static("public"));

const layout_head = compile(
	fs.readFileSync("./views/includes/layout_head.tl", "utf8")
);
const layout_footer = compile(
	fs.readFileSync("./views/includes/layout_footer.tl", "utf8")
);

app.get("/", function(req, res) {
	const index_file = compile(fs.readFileSync("./views/index.tl", "utf8"));

	console.log(
		index_file({
			layout_head: layout_head({
				title: "Home"
			}),
			layout_footer: layout_footer()
		})
	);

	res.send(
		index_file({
			layout_head: layout_head({
				title: "Home"
			}),
			layout_footer: layout_footer()
		})
	);
});

app.get("/videos/background.webm", function(req, res) {
	const path = "./public/videos/wollheim.webm";
	const stat = fs.statSync(path);
	const fileSize = stat.size;
	const range = req.headers.range;
	if (range) {
		const parts = range.replace(/bytes=/, "").split("-");
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
		const chunksize = end - start + 1;
		const file = fs.createReadStream(path, {
			start,
			end
		});
		const head = {
			"Content-Range": `bytes ${start}-${end}/${fileSize}`,
			"Accept-Ranges": "bytes",
			"Content-Length": chunksize,
			"Content-Type": "video/webm"
		};
		res.writeHead(206, head);
		file.pipe(res);
	} else {
		const head = {
			"Content-Length": fileSize,
			"Content-Type": "video/webm"
		};
		res.writeHead(200, head);
		fs.createReadStream(path).pipe(res);
	}
});

app.get("/videos/background.mp4", function(req, res) {
	const path = "./public/videos/wollheim_background_video_no_sound.mp4";
	const stat = fs.statSync(path);
	const fileSize = stat.size;
	const range = req.headers.range;
	if (range) {
		const parts = range.replace(/bytes=/, "").split("-");
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
		const chunksize = end - start + 1;
		const file = fs.createReadStream(path, {
			start,
			end
		});
		const head = {
			"Content-Range": `bytes ${start}-${end}/${fileSize}`,
			"Accept-Ranges": "bytes",
			"Content-Length": chunksize,
			"Content-Type": "video/mp4"
		};
		res.writeHead(206, head);
		file.pipe(res);
	} else {
		const head = {
			"Content-Length": fileSize,
			"Content-Type": "video/mp4"
		};
		res.writeHead(200, head);
		fs.createReadStream(path).pipe(res);
	}
});

app.set("trust proxy", true);

app.listen(process.env.PORT || 3003);
