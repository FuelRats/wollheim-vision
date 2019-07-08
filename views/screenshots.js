module.exports = function(keys) {
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
                ${keys.galleryHtml}
                <hr noshade />
            </div>
        </div>
        </main>
    </body>
    ${keys.layout_footer}`.trim();
};
