const vega_contents = Array.from(document.getElementsByClassName('vega-lite'));

vega_contents.forEach(content => {
  const temp = JSON.parse(content.innerText);
  vegaEmbed(content, temp);
});