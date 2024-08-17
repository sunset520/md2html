const smiles_urlparse = document.scripts[document.scripts.length - 1].src.split("?");

const smiles_values = {};

if (smiles_urlparse.length > 1) {
    const params = new URLSearchParams(smiles_urlparse[1]);
    for (const [key, value] of params) {
        smiles_values[key] = value;
    }
}

let moleculeOptions = {};
let reactionOptions = {};

const smilesDrawer = new SmilesDrawer.SmiDrawer(moleculeOptions, reactionOptions);

Array.from(document.getElementsByClassName('smiles')).forEach(content => {
    smilesDrawer.draw(content.childNodes[1].innerText, '#' + content.childNodes[0].id, smiles_values['theme']);
    content.removeChild(content.childNodes[1]);
});