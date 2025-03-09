export const downloadFile = (fileName, content) => {
    const link = document.createElement('a');

    let finalFileName = fileName;
    const extension = fileName.split('.').pop().toLowerCase();

    let mimeType = 'application/octet-stream';
    switch (extension) {
        case 'pdf':
            mimeType = 'application/pdf';
            break;
        case 'docx':
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            break;
        case 'xlsx':
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            break;
        case 'txt':
            mimeType = 'text/plain';
            break;
        case 'zip':
            mimeType = 'application/zip';
            break;
        case 'rar':
            mimeType = 'application/x-rar-compressed';
            break;
        default:
            console.log('Bilinmeyen dosya türü:', extension);
            break;
    }

    if (!fileName.includes('.')) {
        finalFileName = `${fileName}`;
    }

    fetch(content)
        .then(response => response.blob())
        .then(blob => {
            const blobURL = URL.createObjectURL(blob);
            link.href = blobURL;
            link.download = finalFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobURL);
        })
        .catch();
};