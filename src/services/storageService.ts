import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp();
} else {
    admin.app();
}

const bucket = admin.storage().bucket();

export const uploadFileToStorage = async (file: Express.Multer.File): Promise<string> => {
    try {
        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        return new Promise((resolve, reject) => {
            blobStream.on('error', (err) => reject(err));
            blobStream.on('finish', () => {
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                resolve(publicUrl);
            });

            blobStream.end(file.buffer);
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);
        } else {
            throw new Error('Erro desconhecido ao fazer upload do arquivo');
        }
    }
};

export const getFileFromStorage = async (fileName: string): Promise<Buffer> => {
    try {
        const file = bucket.file(fileName);
        const fileBuffer = await file.download();
        return fileBuffer[0];
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Erro ao obter o arquivo: ${error.message}`);
        } else {
            throw new Error('Erro desconhecido ao obter o arquivo');
        }
    }
};

export const deleteFileFromStorage = async (fileName: string): Promise<void> => {
    try {
        await bucket.file(fileName).delete();
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Erro ao excluir o arquivo: ${error.message}`);
        } else {
            throw new Error('Erro desconhecido ao excluir o arquivo');
        }
    }
};
