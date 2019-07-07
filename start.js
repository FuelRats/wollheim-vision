"use strict";

const express = require("express"),
	esDyn = require("es6-dynamic-template"),
	path = require("path");

const fs = require("fs"),
	fsLoadCache = require("./fsCache");

const app = express();

app.set("views", "views");
app.use(express.static("public"));

const galleryImagesPath = process.env.GALLERYPATH || "public/testimages";

app.use("/images/screenshots", express.static(galleryImagesPath));

const layout_head_html = fsLoadCache("./views/includes/layout_head.tl", "utf8");
const layout_footer_html = fsLoadCache(
	"./views/includes/layout_footer.tl",
	"utf8"
);

app.get("/", function(req, res) {
	res.send(
		esDyn(fsLoadCache("./views/index.tl", "utf8"), {
			layout_head: esDyn(layout_head_html, {
				title: "Home"
			}),
			layout_footer: esDyn(layout_footer_html)
		})
	);
});

function walkSync(dir, filelist = []) {
	fs.readdirSync(dir).forEach(file => {
		const dirFile = path.join(dir, file);
		try {
			filelist = walkSync(dirFile, filelist);
		} catch (err) {
			if (err.code === "ENOTDIR" || err.code === "EBUSY")
				filelist = [...filelist, dirFile];
			else throw err;
		}
	});
	return filelist;
}

app.get("/screenshots", function(req, res) {
	const fileList = walkSync(galleryImagesPath);

	function _getGalleryURL(pathToFile) {
		return `/images/screenshots/${pathToFile.substr(
			galleryImagesPath.length + 1
		)}`;
	}

	let galleryHtml = `Oh hai<br />
    <div class="screenshotHolder">${fileList
		.map(i => {
			return `<img class="screenshot-image" src="${_getGalleryURL(
				i
			)}" />`;
		})
		.join("")}</div>`;

	res.send(
		esDyn(fsLoadCache("./views/screenshots.tl", "utf8"), {
			layout_head: esDyn(layout_head_html, {
				title: "Screenshots"
			}),
			galleryHtml,
			layout_footer: esDyn(layout_footer_html)
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
