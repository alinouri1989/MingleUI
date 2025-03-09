export function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export const convertFileToBase64WithAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            const arrayBuffer = reader.result;
            const bytes = new Uint8Array(arrayBuffer);
            let binary = "";

            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }

            const base64String = btoa(binary);
            resolve(base64String);
        };

        reader.onerror = (error) => reject(error);
    });
};

export function convertFileToBase64ForGroupPhoto(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}