const plotly_contents = Array.from(document.getElementsByClassName('plotly'));
plotly_contents.forEach(content => {
  const temp = JSON.parse(content.innerText);
  content.innerText = '';
  Plotly.newPlot(content.id, temp);
});