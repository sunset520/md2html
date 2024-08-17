Array.from(document.getElementsByClassName('vega-lite')).forEach(content => {
  const temp = JSON.parse(content.innerText);
  vegaEmbed(content, temp);
});