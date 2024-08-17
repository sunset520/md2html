const qrcode_options = {
    content: "Hello World!",
    join: true
};
Array.from(document.getElementsByClassName('qrcode')).forEach((qrcode) => {
    qrcode_options.content = qrcode.textContent;
    qrcode.innerHTML = new QRCode(qrcode_options).svg();
});
