"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// /src/routes/fileRoutes.ts
const express_1 = require("express");
const fileController_1 = __importDefault(require("../controllers/fileController"));
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' }); // A Multer ainda será necessária para o processo de upload temporário
router.get('/files', fileController_1.default.getAll); // Rota para listar arquivos
router.post('/files/upload', upload.single('file'), fileController_1.default.upload); // Rota de upload de arquivo
router.get('/files/:name', fileController_1.default.download); // Rota de download de arquivo
router.delete('/files/:name', fileController_1.default.delete); // Rota de exclusão de arquivo
exports.default = router;
