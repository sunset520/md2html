const path = require('path');
const fs = require('fs');
const vm = require('vm');
const fm = require('front-matter');
const marked = require('marked');
const markdownIt = require('markdown-it');
const sluggerUnique = require('slugger-unique');
const extendedTables = require('marked-extended-tables');
const nomnoml = require('nomnoml');
const markedAlert = require('marked-alert');
const bitfieldRender = require('bit-field/lib/render');
const onml = require('onml');
const markedFootnote = require('marked-footnote');
// const {markedEmoji} = require('marked-emoji');

function readAllFiles(dirPath) {
    let fileList = [];
    let stack = [dirPath];

    while (stack.length > 0) {
        let currentPath = stack.pop();
        const files = fs.readdirSync(currentPath);

        for (const file of files) {
            const filePath = path.join(currentPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                stack.push(filePath);
            } else {
                if (file.endsWith('.md')) {
                    fileList.push({
                        size: stats.size,
                        name: file,
                        path: filePath
                    });
                }
            }
        }
    }

    return fileList;
}

// 转换 md 文件为 html
function convert(jsonObj) {

    let fileList = readAllFiles(jsonObj.source_path);
    let needFileList = [];
    if (jsonObj.is_debug) {
        needFileList = fileList;
    } else {
        const fileData = fs.readFileSync(jsonObj.list_path, 'utf-8');
        const lines = fileData.split('\n');
        const paths = [];
        const times = [];

        for (const line of lines) {
            const [path, time] = line.split('#');
            paths.push(path);
            times.push(time);
        }
        for (const file of fileList) {
            const filePath = file.path.toString();

            if (paths.includes(filePath)) {
                const index = paths.indexOf(filePath);
                const fileModifiedTime = fs.statSync(filePath).mtime.toString();

                if (times[index] !== fileModifiedTime) {
                    needFileList.push(file);
                }
            } else {
                needFileList.push(file);
            }
        }
    }
    const content = fileList.map(item => `${item.path.toString()}#${fs.statSync(item.path).mtime.toString()}`).join('\n');
    fs.writeFileSync(jsonObj.list_path, content);
    console.log('本次需要处理的文章数量：' + needFileList.length);

    // Marked 配置------------------------------------------------------
    const slugger = new sluggerUnique();
    const customBlash = {
        name: 'customBlash',
        level: 'inline',
        hooks: {
            // 处理反斜杠
            preprocess(markdown) {
                return markdown.replace(/\\\\/g, '\\\\\\\\');
            }
        }
    };
    const customImage = {
        name: 'customImage',
        level: 'inline',
        renderer: {
            image(href, title, text) {
                return `<img src="${href}" alt="${text}" class="pic"/>`;
            }
        }
    };
    const customLink = {
        name: 'customLink',
        level: 'inline',
        renderer: {
            link(href, title, text) {
                return `<a href="${href.replace('.md', '.html')}">${text}</a>`;
            }
        }
    };
    const customCode = {
        name: 'customCode',
        level: 'block',
        renderer: {
            code(code, infostring, escaped) {
                const lang = (infostring || '').match(/\S*/)[0];
                if (this.options.highlight) {
                    const out = this.options.highlight(code, lang);
                    if (out != null && out !== code) {
                        escaped = true;
                        code = out;
                    }
                }
                code = code.replace(/\n$/, '') + '\n';
                if (lang === 'mermaid') {
                    return '<div class="mermaid">' + code + '</div>';
                }
                else if (lang === 'smiles') {
                    return '<div class="smiles"><canvas class="smiles" id="' + slugger.slug(lang) + '"><div>' + code.trim() + '</div></canvas></div>';
                }
                else if (lang === 'geogebra-graphing' || lang === 'geogebra-geometry' || lang === 'geogebra-3d') {
                    return '<div class="' + lang + '" id="' + slugger.slug(lang) + '">' + code + '</div>';
                }
                else if (lang === 'dot') {
                    return '<div class="dot" id="' + slugger.slug(lang) + '">' + code + '</div>';
                }
                else if (lang === 'vega-lite') {
                    return '<div class="vega-lite" id="' + slugger.slug(lang) + '">' + code + '</div>';
                }
                else if (lang === 'pseudocode') {
                    return '<div class="pseudocode"><pre><code class="pseudocode">' + code + '</code></pre></div>';
                }
                else if (lang === 'wavedrom') {
                    return '<div class="wavedrom"><script type="WaveDrom">' + code + '</script></div>';
                }
                else if (lang === 'nomnoml') {
                    return '<div class="nomnoml">' + nomnoml.renderSvg(code) + '</div>';
                }
                else if (lang === 'tikz') {
                    return '<div class="tikz"><script type="text/tikz">' + code + '</script></div>';
                }
                else if (lang === 'flowchart') {
                    return '<div class="flowchart"><script id="' + slugger.slug(lang) + '" type="text/flowchart">' + code + '</script></div>';
                }
                else if (lang === 'jsmind') {
                    return '<div class="jsmind"><script id="' + slugger.slug(lang) + '" type="text/jsmind">' + code + '</script></div>';
                }
                else if (lang === 'plotly') {
                    return '<div class="plotly" id="' + slugger.slug(lang) + '">' + code + '</div>\n';
                }
                else if (lang === 'bitfield') {
                    return '<div class="bitfield">' + onml.stringify(bitfieldRender(JSON.parse(code)), jsonObj.extensions.bitfield.config) + '</div>';
                }
                else if (lang === 'chart') {
                    return '<div class="chart"><canvas class="chart" id="' + slugger.slug(lang) + '">' + '<div>' + code.trim() + '</div></canvas></div>';
                }
                else if (lang === 'qrcode') {
                    return '<div class="qrcode">' + code.trim() + '</div>';
                }
                else {
                    return false;
                }
            }
        }
    };
    const customEm = {
        name: 'customEm',
        level: 'inline',
        renderer: {
            em(text) {
                return '_' + text + '_';
            }
        }
    };
    const admonitionExtension = {
        name: 'admonitionExtension',
        level: 'block',
        tokenizer(src, tokens) {
            const rule = /^!!!\s(abstract|attention|bug|caution|danger|error|example|failure|hint|info|note|question|quote|success|tip|warning)\s(.*)\n((\s\s\s\s(.*)\n)*)/;
            const match = rule.exec(src);
            if (match) {
                const token = {
                    type: 'admonitionExtension',
                    raw: match[0],
                    text: match[0].trim(),
                    kind: match[1].trim(),
                    title: match[2].trim(),
                    list: match[3].trim(),
                    tokens: []
                };
                this.lexer.inline(token.text, token.tokens);
                return token;
            }
        },
        renderer(token) {
            let str = token.list.split('\n');
            for (let i = 0; i < str.length; i++) {
                str[i] = '<p>' + str[i].trim() + '</p>';
            }
            str = str.join('');
            return '<div class="admonition admonition-' + token.kind + '">' + '<p class="admonition-title">' + token.title + '</p>' + str + '</div>';
        }
    };
    // 自定义配置
    marked.setOptions(jsonObj.tools.marked.config);
    marked.use(customBlash);
    marked.use(customImage);
    marked.use(customLink);
    marked.use(customCode);
    marked.use(customEm);
    marked.use(extendedTables());
    marked.use(markedAlert(jsonObj.extensions.alert.config));
    marked.use({ extensions: [admonitionExtension] });
    marked.use(markedFootnote());
    // const emojis = JSON.parse(fs.readFileSync('emojis.json', 'utf-8'));
    // marked.use(markedEmoji({
    //     emojis,
    //     unicode: false,
    // }));

    // Marked 配置------------------------------------------------------

    // MarkdownIt 配置--------------------------------------------------
    let markdownit = new markdownIt(jsonObj.tools.markdownit.config);
    // MarkdownIt 配置--------------------------------------------------

    const templateHtml = fs.readFileSync(jsonObj.template_path);
    for (let i = 0; i < needFileList.length; i++) {
        const item = needFileList[i];
        const htmlName = item.name.replace('.md', '').replace('index', (path.basename(path.dirname(item.path))) + '-目录').replace('source', '笔记');
        const htmlPath = item.path.replace('.md', '.html');
        const fileContent = fm(fs.readFileSync(item.path, 'utf-8'));
        let documentObj = {
            title: htmlName,
            public_path: path.relative(path.dirname(htmlPath), jsonObj.public_path).split(path.sep).join('/'),
        };
        if (jsonObj.default_tool == 'marked') {
            documentObj.content = marked.parse(fileContent.body);
        }
        else if (jsonObj.default_tool == 'markdownit') {
            documentObj.content = markdownit.render(fileContent.body);
        }
        let extensionsObj = JSON.parse(JSON.stringify(jsonObj.extensions));
        let fontsObj = JSON.parse(JSON.stringify(jsonObj.fonts));
        const documentExtensions = fileContent.attributes.hasOwnProperty('extensions') ? fileContent.attributes.extensions : [];
        for (key in extensionsObj) {
            if (documentExtensions.includes(key)) {
                extensionsObj[key].enabled = true;
            }
        }
        const documentFonts = fileContent.attributes.hasOwnProperty('fonts') ? fileContent.attributes.fonts : [];
        for (key in fontsObj) {
            if (documentFonts.includes(key)) {
                fontsObj[key].enabled = true;
            }
        }
        documentObj.extensions = extensionsObj;
        documentObj.fonts = fontsObj;
        const compiledHtml = vm.runInNewContext(`\`${templateHtml}\``, documentObj);
        fs.writeFileSync(htmlPath, compiledHtml);
    }
    console.log('转换完成！');
}

convert(JSON.parse(fs.readFileSync('./config.json', 'utf8')));

