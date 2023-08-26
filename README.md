# MD2HTML

## 简介

这是一个可以将 Markdown 文件批量转换为 HTML 的项目，并且支持自定义渲染模板。

## 项目

```plaintext
.
├── LICENSE
├── README.md
├── config.json # 配置
├── md2html.js # 主程序
├── package-lock.json
├── package.json
├── public # HTML 文件依赖的外部资源
├── source # Markdown 源文件 + 转换后的 HTML 文件
└── test # 测试将来要实现的功能
```

## 指令

### 安装依赖

```plaintext
npm install
```

### 执行

```plaintext
npm run start
```

### 生成可执行文件

```plaintext
npm run release
```

## 功能

- [x] Highlight
- [x] MathJax
- [x] Mermaid
- [x] Pseudocode
- [x] Smiles-drawer
- [x] Vega
- [x] Viz
- [x] Wavedrom
- [x] nomnoml
