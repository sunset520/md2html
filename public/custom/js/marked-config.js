// function escape2html(str) {
//   var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
//   return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){
//     return arrEntities[t];
//   });
// }
// marked.setOptions({
//   highlight: function (code, lang) { //  语法高亮
//     let  val  =  code;
//     if (lang) {
//         val  =  hljs.highlight(lang, code).value;
//     } else {
//         val  =  hljs.highlightAuto(code).value;
//     }
//     return  val;
//   }
// });
// let markdown = document.getElementById('main');
// markdown.innerHTML = marked.parse(escape2html(markdown.innerHTML));