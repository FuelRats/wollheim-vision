module.exports = function(keys) {
	const maxItemsPerPage = 12;

	function _getImageFileName(pathToFile) {
		return pathToFile.substr(keys.galleryImagesPath.length + 1);
	}
	function _getGalleryURL(pathToFile) {
		return `/images/screenshots/${_getImageFileName(pathToFile)}`;
	}

	function _getThumbnailURL(pathToFile) {
		return `/images/screenshots/thumbnails/${_getImageFileName(
			pathToFile
		)}`;
	}

	function _renderPager(currentPage, itemCount) {
		const totalPages = Math.ceil(itemCount / maxItemsPerPage);

		let pages = [];

		for (let p = 1; p <= totalPages; p++) {
			pages.push(
				`<a href="/screenshots/${p}" class="pager-button ${
					currentPage == p ? "currentPage" : ""
				}">${p}</a>`
			);
		}

		return /*html*/ `
    <div class="pager">
    ${pages.join(" ")}
    </div>`;
	}

	const allImages = keys.fileList.map(i => {
		return `<a href="${_getGalleryURL(
			i
		)}" target="_blank" data-lightbox="screenshots" data-title="${_getImageFileName(
			i
		)}" data-alt="${_getImageFileName(
			i
		)}"><img class="screenshot-image" loading="lazy" src="${_getThumbnailURL(
			i
		)}" /></a>`;
	});

	let pagedItems = allImages.slice(maxItemsPerPage * (keys.currentPage - 1));

	if (pagedItems.length > 12) {
		pagedItems = pagedItems.slice(0, 12);
	}

	return /*html*/ `${keys.layout_head}
    <body class="mainBody screenshots">
    <div class='background-video'>
        <video autoplay='1' loop='1' muted playsinline poster='/images/background.jpg'>
          <source src='/videos/background.webm' type='video/webm' />
          <source src='/videos/background.mp4' type='video/mp4' />
        </video>
        </div>
      <main id='page-container' class='page' style='height: 100%;'>
        <div class='nm row hcenter vcenter' style='height: 100%;'>
            <div class='under_construction_banner'>
                <h1>Wollheim Vision</h1>
                <b>Here are some screenshots from our rats!</b><br />
                <a href="/upload" target="_blank">I wanna upload some nice screenshots too!</a>
                <hr noshade />
                <div class="screenshotHolder">${pagedItems.join("")}</div>
                <hr noshade />
                ${_renderPager(
					keys.currentPage,
					keys.fileList.length,
					maxItemsPerPage
				)}
            </div>
        </div>
      </main>
      <script src="/lightbox2/js/lightbox-plus-jquery.min.js"></script>
    </body>
    ${keys.layout_footer}`.trim();
};
