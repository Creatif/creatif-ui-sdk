onmessage = async (e) => {
    const files = e.data;
    let areUrlsOnly = files.every((f) => Object.hasOwn(f, 'id') && Object.hasOwn(f, 'url'));

    let result = {
        result: [],
        error: undefined,
    };

    if (areUrlsOnly) {
        const results = [];
        const promises = [];
        for (const f of files) {
            promises.push(toBase64(f));
        }

        try {
            const resolvedPromises = await Promise.all(promises);

            for (const p of resolvedPromises) {
                if (p.error) {
                    return {
                        error: p.error,
                    };
                }

                results.push(p);
            }
        } catch (e) {
            results.push({
                error: e.message,
            });
        }

        postMessage({
            isUpdate: true,
            result: results,
        });

        return;
    }

    const results = [];
    for (const file of files) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        const singleResult = await promisifySingleConversion(file);

        if (singleResult.error) {
            return {
                error: singleResult.error,
            };
        }

        results.push(singleResult);
    }

    result.result = results;

    postMessage(result);
};

function promisifySingleConversion(file) {
    let result = {
        result: undefined,
        error: undefined,
    };

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    return new Promise((resolve) => {
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
            result.type = file.type;

            resolve(result);
        };

        reader.onerror = () => {
            result.error = 'An error occurred while trying to create base64 image representation';

            resolve(result);
        };
    });
}

async function toBase64(url) {
    let result = {
        result: undefined,
        error: undefined,
    };

    try {
        const response = await fetch(url.url, {
            method: 'get',
            credentials: 'include',
            cache: 'no-cache',
        });

        const blob = await response.blob();

        result.result = await toFileReaderPromise(blob);
        result.size = blob.size;
        result.id = url.id;
        result.type = blob.type;

        return result;
    } catch (e) {
        result.error = e.message;
        return result;
    }
}

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
