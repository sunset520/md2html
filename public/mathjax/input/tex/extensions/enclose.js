(()=>{"use strict";var e={d:(a,t)=>{for(var o in t)e.o(t,o)&&!e.o(a,o)&&Object.defineProperty(a,o,{enumerable:!0,get:t[o]})},o:(e,a)=>Object.prototype.hasOwnProperty.call(e,a),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},a={};e.r(a),e.d(a,{ENCLOSE_OPTIONS:()=>M,EncloseConfiguration:()=>b,EncloseMethods:()=>g});const t=("undefined"!=typeof window?window:global).MathJax._.components.global,o=(t.GLOBAL,t.isObject,t.combineConfig,t.combineDefaults,t.combineWithMathJax),n=(t.MathJax,MathJax._.input.tex.HandlerTypes),r=n.ConfigurationType,i=n.HandlerType,l=MathJax._.input.tex.Configuration,c=l.Configuration,s=(l.ConfigurationHandler,l.ParserConfiguration,MathJax._.input.tex.TokenMap),p=(s.parseResult,s.AbstractTokenMap,s.RegExpMap,s.AbstractParseMap,s.CharacterMap,s.DelimiterMap,s.MacroMap,s.CommandMap),d=(s.EnvironmentMap,MathJax._.input.tex.ParseUtil),u=(d.KeyValueType,d.KeyValueTypes,d.ParseUtil),M={"data-arrowhead":1,color:1,mathcolor:1,background:1,mathbackground:1,"data-padding":1,"data-thickness":1},g={Enclose(e,a){let t=e.GetArgument(a).replace(/,/g," ");const o=e.GetBrackets(a,""),n=e.ParseArg(a),r=u.keyvalOptions(o,M);r.notation=t,e.Push(e.create("node","menclose",[n],r))}};new p("enclose",{enclose:g.Enclose});const b=c.create("enclose",{[r.HANDLER]:{[i.MACRO]:["enclose"]}});MathJax.loader&&MathJax.loader.checkVersion("[tex]/enclose","4.0.0-beta.7","tex-extension"),o({_:{input:{tex:{enclose:{EncloseConfiguration:a}}}}})})();