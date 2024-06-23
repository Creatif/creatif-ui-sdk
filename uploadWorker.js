onmessage = (e) => {
    const file = e.data;
    if (typeof file === 'string') {
        toBase64(`http://localhost:5173${file}`, (base64Image) => {
            postMessage({
                image: base64Image,
                isUpdate: true,
            });
        });

        return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = async () => {
        const arr = new Uint8Array(reader.result);
        const str = arr.reduce((data, byte) => data + String.fromCharCode(byte), '');

        const split = file.name.split('.');
        let data = `data:${file.type}`;
        if (split.length > 1) {
            data = `data:${file.type}#${split[split.length - 1]}`;
        }

        const base64 = btoa(str);
        postMessage(`${data};base64,${base64}`);
    };
};

function toBase64(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const reader = new FileReader();
        reader.readAsArrayBuffer(xhr.response);

        reader.onloadend = async () => {
            const arr = new Uint8Array(reader.result);
            const str = arr.reduce((data, byte) => data + String.fromCharCode(byte), '');

            const split = url.split('.');
            let data = `data:text/html#${split[1]}`;

            const base64 = btoa(str);
            callback(`${data};base64,${base64}`);
        };
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}
