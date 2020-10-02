export function get({ url, progress, error, responseType }) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    responseType && (xhr.responseType = responseType)
    xhr.send(null);

    return new Promise((resolve, reject) => {
        // 完成
        xhr.onload = () => {
            resolve(xhr.response)
        };

        // 进度
        xhr.addEventListener('progress', e => {
            progress && progress(e.loaded / e.total)
        })
    })
}

export function loadTexture(url) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.load(url, (res) => {
            resolve(res)
        });
    })
}
