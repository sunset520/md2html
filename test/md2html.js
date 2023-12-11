import path from 'path';
import fs from 'fs';
import vm from 'vm';
import fm from 'front-matter';
import { marked } from 'marked';
import { gfmHeadingId } from "marked-gfm-heading-id";
import extendedTables from 'marked-extended-tables';
import nomnoml from 'nomnoml';
import markedAlert from 'marked-alert';

// 模板编译
const templateCompile = (template, data) => {
    return vm.runInNewContext(`\`${template}\``, data);
};

function readAllFiles(dirPath, filesList) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            readAllFiles(filePath, filesList);
        } else if (file.endsWith('.md')) {
            filesList.push({
                size: stats.size,
                name: file,
                path: filePath
            });
        }
    }
}

// 获取文件列表
function getFileList(dirPath) {
    const filesList = [];
    readAllFiles(dirPath, filesList);
    return filesList;
}

// 写文件列表
function writeList(list, listPath) {
    const content = list.map(item => `${item.path.toString()}#${fs.statSync(item.path).mtime.toString()}`).join('\n');
    fs.writeFileSync(listPath, content);
}

// 读取文件列表
function readList(listPath) {
    const fileData = fs.readFileSync(listPath, 'utf-8');
    const lines = fileData.split('\n');
    const paths = [];
    const times = [];

    for (const line of lines) {
        const [path, time] = line.split('#');
        paths.push(path);
        times.push(time);
    }

    return {
        path: paths,
        time: times
    };
}

// 转换 md 文件为 html
function convert(jsonObj) {

    // 读取配置信息
    let isDebug = jsonObj.isDebug;
    let theme = jsonObj.theme;
    let highlightTheme = jsonObj.highlightTheme;
    let mermaidTheme = jsonObj.mermaidTheme;
    let smilesTheme = jsonObj.smilesTheme;
    let wavedromTheme = jsonObj.wavedromTheme;
    let jsmindTheme = jsonObj.jsmindTheme;
    let sourcePath = jsonObj.sourcePath;
    let publicPath = jsonObj.publicPath;
    let allExtensions = jsonObj.allExtensions;
    let defaultExtensions = jsonObj.defaultExtensions;

    let listPath = path.join(sourcePath, 'list.txt');
    let templatePath = path.join(publicPath, 'template.html');


    // 获取所有文件
    let fileList = getFileList(sourcePath);
    let needFileList = [];
    if (isDebug) {
        needFileList = fileList;
    }
    else {
        // 只更新修改过的文件
        let list1 = [];
        let list2 = [];
        let obj = readList(listPath);
        list1 = obj.path;
        list2 = obj.time;
        for (let i = 0; i < fileList.length; i++) {
            if (list1.includes(fileList[i].path.toString())) {
                let index = list1.indexOf(fileList[i].path.toString());
                if (list2[index] !== fs.statSync(fileList[i].path).mtime.toString()) {
                    needFileList.push(fileList[i]);
                }
            }
            else {
                needFileList.push(fileList[i]);
            }
        }
    }
    // 写入最新的文件信息
    writeList(fileList, listPath);
    // 输出日志
    console.log('本次需要处理的文章数量：' + needFileList.length);

    // 处理
    const slugger = new marked.Slugger();
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
                else if (lang === 'geogebra-graphing') {
                    return '<div class="geogebra-graphing" id="' + slugger.slug(lang) + '">' + code + '</div>\n';
                }
                else if (lang === 'geogebra-geometrys') {
                    return '<div class="geogebra-geometrys" id="' + slugger.slug(lang) + '">' + code + '</div>\n';
                }
                else if (lang === 'geogebra-3ds') {
                    return '<div class="geogebra-3ds" id="' + slugger.slug(lang) + '">' + code + '</div>\n';
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
    marked.setOptions({
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        mangle: false
    });
    marked.use(customBlash);
    marked.use(customImage);
    marked.use(customLink);
    marked.use(customCode);
    marked.use(customEm);
    marked.use(gfmHeadingId({
        prefix: 'H-'
    }));
    marked.use(extendedTables());
    marked.use(markedAlert({
        variants: [
            {
                type: 'danger',
                icon: '<i class="mr-2">🚨</i>',
                title: 'Oh snap!', // optional
                titleClassName: 'text-danger' // optional
            }
        ]
    }));
    marked.use({ extensions: [admonitionExtension] });

    for (let i = 0; i < needFileList.length; i++) {
        const item = needFileList[i];
        const templateHtml = fs.readFileSync(templatePath);
        const htmlName = item.name.replace('.md', '').replace('index', path.basename(path.dirname(item.path))).replace('source', '笔记');
        const htmlPath = item.path.replace('.md', '.html');

        const fileContent = fm(fs.readFileSync(item.path, 'utf-8'));
        let currentExtensions = fileContent.attributes.extensions ? fileContent.attributes.extensions : [];
        currentExtensions = currentExtensions.concat(defaultExtensions);
        let contextData = {
            title: htmlName,
            content: marked.parse(fileContent.body),
            public_path: path.relative(path.dirname(htmlPath), publicPath).split(path.sep).join('/'),
            theme: theme,
            highlight_theme: highlightTheme,
            mermaid_theme: mermaidTheme,
            smiles_theme: smilesTheme,
            wavedrom_theme: wavedromTheme,
            jsmind_theme: jsmindTheme
        };

        for (let j = 0; j < allExtensions.length; j++) {
            let extension = allExtensions[j];
            contextData[extension + '_1'] = '<!-- ';
            contextData[extension + '_2'] = ' -->';
        }

        for (let j = 0; j < currentExtensions.length; j++) {
            let extension = currentExtensions[j];
            contextData[extension + '_1'] = '';
            contextData[extension + '_2'] = '';
        }
        const compiledHtml = templateCompile(templateHtml, contextData);
        fs.writeFileSync(`${htmlPath}`, compiledHtml);
    }
}

// 读取JSON文件
fs.readFile('./config.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("读取配置文件失败：", err);
        return;
    }
    try {
        // 将JSON字符串转换为对象
        const jsonObj = JSON.parse(jsonString);
        // 调用函数并将数据作为参数传递
        convert(jsonObj);
    } catch (err) {
        console.log('解析失败：', err);
    }
});

