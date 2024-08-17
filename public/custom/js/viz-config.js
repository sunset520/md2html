const viz = new Viz();
Array.from(document.getElementsByClassName('dot')).forEach(graph => {
    viz.renderSVGElement(graph.innerText).then(element => {
        graph.innerText = "";
        graph.appendChild(element);
    });
});