Array.from(document.getElementsByClassName('plotly')).forEach(content => {
    const temp = JSON.parse(content.innerText);
    content.innerText = '';
    Plotly.newPlot(content.id, temp);
});