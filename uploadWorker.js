onmessage = (e) => {
    const file = e.data;
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
