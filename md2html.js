const path = require('path');
const fs = require('fs');
const vm = require('vm');
const fm = require('front-matter');
const marked = require('marked');
const sluggerUnique = require('slugger-unique');
const extendedTables = require('marked-extended-tables');
const nomnoml = require('nomnoml');
const markedAlert = require('marked-alert');
const bitfieldRender = require('bit-field/lib/render');
const onml = require('onml');

function readAllFiles(dirPath) {
    let fileList = [];

    function traverseDirectory(currentPath) {
        const files = fs.readdirSync(currentPath);

        for (const file of files) {
            const filePath = path.join(currentPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                traverseDirectory(filePath); // 递归遍历子文件夹
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

    traverseDirectory(dirPath);
    return fileList;
};

// 转换 md 文件为 html
function convert(jsonObj) {

    let fileList = readAllFiles(jsonObj.source_path);
    const listPath = path.join(jsonObj.source_path, 'list.txt');
    let needFileList = [];
    if (jsonObj.is_debug) {
        needFileList = fileList;
    } else {
        const fileData = fs.readFileSync(listPath, 'utf-8');
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
    fs.writeFileSync(listPath, content);
    console.log('本次需要处理的文章数量：' + needFileList.length);

    // 处理
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
                    return '<div class="mermaid">' + code + '</div>\n';
                }
                else if (lang === 'smiles') {
                    return '<canvas class="smiles" id="' + slugger.slug(lang) + '"><div>' + code.trim() + '</div></canvas>';
                }
                else if (lang === 'geogebra-graphing' || lang === 'geogebra-geometry' || lang === 'geogebra-3d') {
                    return '<br /><div class="' + lang + '" id="' + slugger.slug(lang) + '">' + code + '</div><br />';
                }
                else if (lang === 'dot') {
                    return '<div class="dot" id="' + slugger.slug(lang) + '">' + code + '</div>\n';
                }
                else if (lang === 'vega-lite') {
                    return '<div class="vega-lite" id="' + slugger.slug(lang) + '">' + code + '</div>\n';
                }
                else if (lang === 'pseudocode') {
                    return '<pre><code class="pseudocode">' + code + '</code></pre>\n';
                }
                else if (lang === 'wavedrom') {
                    return '<script type="WaveDrom">' + code + '</script>\n';
                }
                else if (lang === 'nomnoml') {
                    return nomnoml.renderSvg(code);
                }
                else if (lang === 'tikz') {
                    return '<script type="text/tikz">' + code + '</script>\n';
                }
                else if (lang === 'flowchart') {
                    return '<script id="' + slugger.slug(lang) + '" type="text/flowchart">' + code + '</script>\n';
                }
                else if (lang === 'jsmind') {
                    return '<script id="' + slugger.slug(lang) + '" type="text/jsmind">' + code + '</script>\n';
                }
                else if (lang === 'plotly') {
                    return '<div class="plotly" id="' + slugger.slug(lang) + '">' + code + '</div>\n';
                }
                else if (lang === 'bitfield') {
                    return onml.stringify(bitfieldRender(JSON.parse(code)), jsonObj.extensions_config.bitfield_config);
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
    marked.setOptions(jsonObj.extensions_config.marked_config);
    marked.use(customBlash);
    marked.use(customImage);
    marked.use(customLink);
    marked.use(customCode);
    marked.use(customEm);
    marked.use(extendedTables());
    marked.use(markedAlert(jsonObj.extensions_config.marked_alert_config));
    marked.use({ extensions: [admonitionExtension] });

    const templateHtml = fs.readFileSync(path.join(jsonObj.public_path, 'template.html'));
    for (let i = 0; i < needFileList.length; i++) {
        const item = needFileList[i];
        const htmlName = item.name.replace('.md', '').replace('index', (path.basename(path.dirname(item.path))) + '-目录').replace('source', '笔记');
        const htmlPath = item.path.replace('.md', '.html');

        const fileContent = fm(fs.readFileSync(item.path, 'utf-8'));
        let currentExtensions = fileContent.attributes.extensions ? fileContent.attributes.extensions : [];
        currentExtensions = currentExtensions.concat(jsonObj.default_extensions);
        let documentObj = {
            title: htmlName,
            content: marked.parse(fileContent.body),
            public_path: path.relative(path.dirname(htmlPath), jsonObj.public_path).split(path.sep).join('/'),
        };
        let contextData = Object.assign(jsonObj.extensions_config, documentObj);

        for (let j = 0; j < jsonObj.all_extensions.length; j++) {
            let extension = jsonObj.all_extensions[j];
            contextData[extension + '_1'] = '<!-- ';
            contextData[extension + '_2'] = ' -->';
        }

        for (let j = 0; j < currentExtensions.length; j++) {
            let extension = currentExtensions[j];
            contextData[extension + '_1'] = '';
            contextData[extension + '_2'] = '';
        }
        const compiledHtml = vm.runInNewContext(`\`${templateHtml}\``, contextData);
        fs.writeFileSync(htmlPath, compiledHtml);
    }
    console.log('转换完成！');
};

convert(JSON.parse(fs.readFileSync('./config.json', 'utf8')));

