const arr = document.getElementsByTagName("pre");
const classNames = ["mermaid", "dot", "vega-lite", "smiles", "geogebra-graphing", "geogebra-geometry", "geogebra-3d", "pseudocode", "wavedrom", "nomnoml", "tikz", "flowchart", "jsmind", "plotly","chart"];

const temparr = Array.from(arr).filter(item => !classNames.some(className => item.childNodes[0].classList.contains(className)));

temparr.forEach(item => {
  item.style.position = "relative";
  const copyButton = document.createElement("button");
  copyButton.className = 'copycodebutton';
  copyButton.innerHTML = "复制";
  copyButton.onclick = () => {
    const copyData = item.firstChild.innerText;
    copyToClipboard(copyData);
    copyButton.innerHTML = "复制成功";
    setTimeout(() => {
      copyButton.innerHTML = "复制";
    }, 1000);
  };
  item.appendChild(copyButton);
});

// js 复制到剪贴板
const copyToClipboard = (content) => {
  if (window.clipboardData) {
    window.clipboardData.setData('text', content);
  } else {
    document.oncopy = (e) => {
      e.clipboardData.setData('text', content);
      e.preventDefault();
      document.oncopy = null;
    };
    document.execCommand('Copy');
  }
};