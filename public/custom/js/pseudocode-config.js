const pseudocodes = document.querySelectorAll("code.pseudocode");
const pseudocode_options = {
    lineNumber: true
};

pseudocodes.forEach((pse) => {
    const code = pse.textContent;
    const parentEl = pse.parentElement;
    pseudocode.render(code, parentEl, pseudocode_options);
    pse.remove();
    $(parentEl).replaceWith($(`<div>${parentEl.innerHTML}</div>`));
});
