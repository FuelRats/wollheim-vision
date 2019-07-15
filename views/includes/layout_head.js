module.exports = function(keys) {
	return /*html*/ `<!doctype HTML>
<html>
  <head>
    <title>${keys.title} - Wollheim Vision</title>
    <link rel='stylesheet' href='/stylesheets/elk.min.css' />
    <link rel='stylesheet' href='/stylesheets/wollheim.css' />
    ${keys.head ? keys.head : ""}
  </head>`;
};
