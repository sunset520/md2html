const chart_contents = document.querySelectorAll("canvas.chart");

chart_contents.forEach(content => {
    new Chart(content, JSON.parse(content.childNodes[0].innerText));
});