let geogebra_graphings = document.getElementsByClassName('geogebra-graphing');
let geogebra_geometrys = document.getElementsByClassName('geogebra-geometry');
let geogebra_3ds = document.getElementsByClassName('geogebra-3d');

const geogebra_urlparse = document.scripts[document.scripts.length - 1].src.split("?");

const geogebra_values = {};

if (geogebra_urlparse.length > 1) {
  const params = new URLSearchParams(geogebra_urlparse[1]);
  for (const [key, value] of params) {
    geogebra_values[key] = value;
  }
}

for (let i = 0; i < geogebra_graphings.length; i++) {
    let ggbBase64_str_graphing = geogebra_graphings[i].innerText;
    let params_graphing =
    {
        "appName": "graphing",
        "width": 800,
        "height": 600,
        "showToolBar": false,
        "showAlgebraInput": false,
        "showMenuBar": false,
        "ggbBase64": ggbBase64_str_graphing
    };
    let applet_graphing = new GGBApplet(params_graphing, true);
    applet_graphing.setHTML5Codebase(geogebra_values["path"] + "/geogebra/HTML5/5.0/web3d/");
    applet_graphing.inject(geogebra_graphings[i].id);
};

for (let i = 0; i < geogebra_geometrys.length; i++) {
    let ggbBase64_str_geometrys = geogebra_geometrys[i].innerText;
    let params_geometrys =
    {
        "appName": "geometry",
        "width": 800,
        "height": 600,
        "showToolBar": false,
        "showAlgebraInput": false,
        "showMenuBar": false,
        "ggbBase64": ggbBase64_str_geometrys
    };
    let applet_geometrys = new GGBApplet(params_geometrys, true);
    applet_geometrys.setHTML5Codebase(geogebra_values["path"] + "/geogebra-5.2.817.0/HTML5/5.0/web3d/");
    applet_geometrys.inject(geogebra_geometrys[i].id);
};

for (let i = 0; i < geogebra_3ds.length; i++) {
    let ggbBase64_str_3ds = geogebra_3ds[i].innerText;
    let params_3ds =
    {
        "appName": "3d",
        "width": 800,
        "height": 600,
        "showToolBar": false,
        "showAlgebraInput": false,
        "showMenuBar": false,
        "ggbBase64": ggbBase64_str_3ds
    };
    let applet_3ds = new GGBApplet(params_3ds, true);
    applet_3ds.setHTML5Codebase(geogebra_values["path"] + "/geogebra-5.2.817.0/HTML5/5.0/web3d/");
    applet_3ds.inject(geogebra_3ds[i].id);
};