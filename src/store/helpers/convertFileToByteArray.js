export function convertFileToByteArray(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const arrayBuffer = reader.result; // Dosyanın ArrayBuffer'ı
            const byteArray = new Uint8Array(arrayBuffer); // Uint8Array'e çevir
            resolve(byteArray);
        };
        reader.onerror = () => reject('FileReader error occurred.');
        reader.readAsArrayBuffer(file); // ArrayBuffer olarak oku
    });
}