export const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('image')) return 'image';
    if (fileType.includes('pdf')) return 'pdf';
    if (fileType.includes('word') || fileType.includes('doc')) return 'doc';
    return 'file';
};

export const canPreviewInBrowser = (fileType: string) => {
    return fileType.includes('image') || fileType.includes('pdf');
};