const qrcodes = Array.from(document.getElementsByClassName('qrcode'));
const qrcode_options = {
    content: "Hello World!",
    join: true
};
qrcodes.forEach((qrcode) => {
    qrcode_options.content = qrcode.textContent;
    qrcode.innerHTML = new QRCode(qrcode_options).svg();
});
