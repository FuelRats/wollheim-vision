module.exports = function(keys) {
	function _getGalleryURL(pathToFile) {
		return `/images/screenshots/thumbnails/${pathToFile.substr(
			keys.galleryImagesPath.length + 1
		)}`;
	}

	return /*html*/ `${keys.layout_head}
    <body class="mainBody screenshots">
    <div class='background-video'>
        <video autoplay='1' loop='1' muted playsinline poster='images/background.jpg'>
          <source src='videos/background.webm' type='video/webm' />
          <source src='videos/background.mp4' type='video/mp4' />
        </video>
        </div>
      <main id='page-container' class='page' style='height: 100%;'>
        <div class='nm row hcenter vcenter' style='height: 100%;'>
            <div class='under_construction_banner'>
                <h1>Wollheim Vision</h1>
                <b>Here are some screenshots from our rats!</b>
                <hr noshade />
                <div class="screenshotHolder">${keys.fileList
					.map(i => {
						return `<img class="screenshot-image" loading="lazy" src="${_getGalleryURL(
							i
						)}" />`;
					})
					.join("")}</div>
                <hr noshade />
            </div>
        </div>
        </main>
    </body>
    ${keys.layout_footer}`.trim();
};
