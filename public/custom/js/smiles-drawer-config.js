const smiles_urlparse = document.scripts[document.scripts.length - 1].src.split("?");

const smiles_values = {};

if (smiles_urlparse.length > 1) {
  const params = new URLSearchParams(smiles_urlparse[1]);
  for (const [key, value] of params) {
    smiles_values[key] = value;
  }
}

// const smiles_options = {
//   width: 300,
//   height: 200,
// };

let moleculeOptions = {};
let reactionOptions = {};

const smilesDrawer = new SmilesDrawer.SmiDrawer(moleculeOptions, reactionOptions);

const smiles_contents = Array.from(document.getElementsByClassName('smiles'));

smiles_contents.forEach(content => {
  smilesDrawer.draw(content.childNodes[1].innerText,'#'+content.childNodes[0].id,smiles_values['theme']);
  // content.childNodes[1].innerText = '';
  content.removeChild(content.childNodes[1]);
});

// smiles_contents.forEach(content => {
//   const smiles_temp = content.childNodes[0].innerText;
//   // SmilesDrawer.parse(smiles_temp, (tree) => {
//   //   smilesDrawer.draw(tree, content.id, smiles_values['theme'], false);
//   // });
//   // console.log('#'+content.id);
//   smilesDrawer.draw(smiles_temp,'#'+content.id,smiles_values['theme']);
// });