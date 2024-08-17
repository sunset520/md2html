const flowchart_process = async (elt) => {
    const text = elt.childNodes[0].nodeValue;
    const div = document.createElement('div');
    div.id = `${elt.id}-div`;
    const diagram = flowchart.parse(text);
    elt.parentNode.replaceChild(div, elt);
    diagram.drawSVG(div.id);
};

Array.from(document.getElementsByTagName('script')).filter(e => e.getAttribute('type') === 'text/flowchart').reduce(async (promise, element) => {
    await promise;
    return flowchart_process(element);
}, Promise.resolve());