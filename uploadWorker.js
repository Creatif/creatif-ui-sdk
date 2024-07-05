onmessage = (e) => {
    const file = e.data;
    if (typeof file === 'string') {
        toBase64(file).then((result) => {
            if (result) {
                postMessage({
                    isUpdate: true,
                    result: result,
                });
            }
        });

        return;
    }

    let result = {
        result: undefined,
        error: undefined,
    };
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

        result.result = `${data};base64,${btoa(str)}`;
        result.name = file.name;
        result.size = file.size;
        postMessage({
            isUpdate: false,
            result: result,
        });
    };

    reader.onerror = () => {
        result.error = 'An error occurred while trying to create base64 image representation';

        postMessage({
            isUpdate: false,
            result: result,
        });
    };
};

function toFileReaderPromise(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);

        reader.onloadend = async () => {
            const arr = new Uint8Array(reader.result);
            const str = arr.reduce((data, byte) => data + String.fromCharCode(byte), '');

            resolve(btoa(str));
        };

        reader.onerror = () => {
            reject('Could not load blob');
        };
    });
}

async function toBase64(url) {
    let result = {
        result: undefined,
        error: undefined,
    };

    try {
        const response = await fetch(url, {
            method: 'get',
            credentials: 'include',
        });

        const blob = await response.blob();
        result.result = await toFileReaderPromise(blob);

        return result;
    } catch (e) {
        result.error = e.message;
        return result;
    }
}
