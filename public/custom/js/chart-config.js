document.querySelectorAll("canvas.chart").forEach(content => {
    new Chart(content, JSON.parse(content.childNodes[0].innerText));
});