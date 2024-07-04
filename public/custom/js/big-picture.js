$(function () {
    $(".pic").click(function () {
        const _this = $(this);
        imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
    });
});

const imgShow = (outerdiv, innerdiv, bigimg, _this) => {
    const src = _this.attr("src");
    $(bigimg).attr("src", src);

    $("<img/>").attr("src", src).load(function () {
        const windowW = $(window).width();
        const windowH = $(window).height();
        const realWidth = this.width;
        const realHeight = this.height;
        let imgWidth, imgHeight;
        const scale = 0.8;

        const realWdivH = realWidth / realHeight;
        const winWdivH = windowW / windowH;

        if (realWdivH > winWdivH) {
            imgWidth = windowW * scale;
            imgHeight = windowW / realWdivH * scale;
        } else {
            imgHeight = windowH * scale;
            imgWidth = windowH * realWdivH * scale;
        }

        $(bigimg).css("width", imgWidth);
        const w = (windowW - imgWidth) / 2;
        const h = (windowH - imgHeight) / 2;
        $(innerdiv).css({ "top": h, "left": w });
        $(outerdiv).fadeIn("fast");
    });

    $(outerdiv).click(function () {
        $(this).fadeOut("fast");
    });
};