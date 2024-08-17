window.MathJax = {
    loader: {
        load: ['ui/lazy', '[tex]/mhchem', '[tex]/enclose'],
        paths: {
            'mathjax-modern': '../../mathjax-modern-font'
        }
    },
    options: {
        enableMenu: true,
        menuOptions: {
            settings: {
                // wideExpressions: 'scroll',
                enrich: false
            }
        },
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'annotation', 'annotation-xml']
    },
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        packages: { '[+]': ['mhchem', 'enclose'] },
        tags: 'ams',
        macros: {
            'coloneqq': ':=',
            'oiint': '∯',
            'oiiint': '∰',
            'knotneacsea': '⤮',
            'knotseacnea': '⤭',
            'knotrdcfd': '⤫',
            'knotfdcrd': '⤬',
            'bigudot': '⨃',
            'bigtimes': '⨉'
        }
    },
    svg: {
        fontCache: 'global'
    },
    output: {
        font: 'mathjax-tex',
        displayOverflow: 'scroll',
        linebreaks: {
            inline: true,
            width: '100%',
            lineleading: .2,
            LinebreakVisitor: null
        }
    }
};

// mjx-container.setAttribute('overflow', 'scroll');

// console.log(window.MathJax);

// (function () {
//   var script = document.createElement('script');
//   console.log(window.location.pathname);
//   script.src = '/mathjax-4.0.0/tex-chtml.js';
//   script.async = true;
//   document.head.appendChild(script);
// })();