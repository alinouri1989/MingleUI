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

        if (file.type.includes("text") || file.type.includes("wordprocessingml")) {
            reader.readAsBinaryString(file);
            reader.onload = () => {
                if (!reader.result || reader.result.trim().length === 0) {
                    reject(new Error("empty_file"));
                } else {
                    resolve(btoa(reader.result));
                }
            };
        } else {
            reader.readAsArrayBuffer(file);
            reader.onload = () => {
                const arrayBuffer = reader.result;
                if (!arrayBuffer || arrayBuffer.byteLength === 0) {
                    reject(new Error("empty_file"));
                    return;
                }

                const bytes = new Uint8Array(arrayBuffer);
                let binary = "";

                for (let i = 0; i < bytes.byteLength; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }

                resolve(btoa(binary));
            };
        }

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