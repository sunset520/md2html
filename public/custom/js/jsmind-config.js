const jsmind_process = async (elt, theme) => {
  const text = elt.childNodes[0].nodeValue;
  const div = document.createElement('div');
  div.id = `${elt.id}-div`;
  div.style.width = "100%";
  div.style.height = "20rem";
  elt.parentNode.replaceChild(div, elt);
  const mind = JSON.parse(text);
  const jsmind_options = {
    container: div.id,
    theme: theme,
    editable: false
  };
  const jm = new jsMind(jsmind_options);
  jm.show(mind);
};

const jsmind_urlparse = document.scripts[document.scripts.length - 1].src.split("?");

const jsmind_values = {};

if (jsmind_urlparse.length > 1) {
  const params = new URLSearchParams(jsmind_urlparse[1]);
  for (const [key, value] of params) {
    jsmind_values[key] = value;
  }
}

const jsmindScripts = Array.from(document.getElementsByTagName('script')).filter(e => e.getAttribute('type') === 'text/jsmind');

jsmindScripts.reduce(async (promise, element) => {
  await promise;
  return jsmind_process(element, jsmind_values['theme']);
}, Promise.resolve());