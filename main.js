async function* foo() {
    for (let i = 0; i < 20; i++) {
        yield await new Promise((resolve) => {
            setTimeout(() => {
                const d = new Date();
                resolve(`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);
            }, 1000);
        });
    }
}

const it = foo();

for await (const num of it) {
    console.log(num);
}
