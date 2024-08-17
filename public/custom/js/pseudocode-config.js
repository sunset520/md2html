const pseudocode_options = {
    lineNumber: true
};

document.querySelectorAll("code.pseudocode").forEach((pse) => {
    const code = pse.textContent;
    const parentEl = pse.parentElement;
    pseudocode.render(code, parentEl, pseudocode_options);
    pse.remove();
    $(parentEl).replaceWith($(`<div>${parentEl.innerHTML}</div>`));
});
