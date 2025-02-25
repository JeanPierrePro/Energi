"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFromStorage = exports.getFileFromStorage = exports.uploadFileToStorage = void 0;
const admin = __importStar(require("firebase-admin"));
if (!admin.apps.length) {
    admin.initializeApp();
}
else {
    admin.app();
}
const bucket = admin.storage().bucket();
const uploadFileToStorage = (file) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);
        }
        else {
            throw new Error('Erro desconhecido ao fazer upload do arquivo');
        }
    }
});
exports.uploadFileToStorage = uploadFileToStorage;
const getFileFromStorage = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = bucket.file(fileName);
        const fileBuffer = yield file.download();
        return fileBuffer[0];
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Erro ao obter o arquivo: ${error.message}`);
        }
        else {
            throw new Error('Erro desconhecido ao obter o arquivo');
        }
    }
});
exports.getFileFromStorage = getFileFromStorage;
const deleteFileFromStorage = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield bucket.file(fileName).delete();
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Erro ao excluir o arquivo: ${error.message}`);
        }
        else {
            throw new Error('Erro desconhecido ao excluir o arquivo');
        }
    }
});
exports.deleteFileFromStorage = deleteFileFromStorage;
