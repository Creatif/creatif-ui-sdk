export function getDimensions(
    url: string,
): Promise<{ dimensions?: { width: number; height: number }; error?: string }> {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = url;

        img.onload = () => {
            resolve({
                dimensions: {
                    width: img.width,
                    height: img.height,
                },
            });
        };

        img.onerror = (e) => {
            if (typeof e === 'string') {
                resolve({
                    error: `This file could not be checked for dimensions. The underlying error is: ${e}`,
                });
                return;
            }

            resolve({
                error: 'This file could not be checked for dimensions',
            });
        };

        img.onabort = () => {
            resolve({
                error: 'aborted',
            });
        };
    });
}
