export function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);  // Remove the data:image part of the base64 string
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}