const mermaid_urlparse = document.scripts[document.scripts.length - 1].src.split("?");

const mermaid_values = {};

if (mermaid_urlparse.length > 1) {
    const params = new URLSearchParams(mermaid_urlparse[1]);
    for (const [key, value] of params) {
        mermaid_values[key] = value;
    }
}

const mermaid_config = {
    startOnLoad: true,
    htmlLabels: true,
    theme: mermaid_values['theme'],
    callback: (id) => { },
    flowchart: {
        useMaxWidth: false,
    }
};

mermaid.initialize(mermaid_config);