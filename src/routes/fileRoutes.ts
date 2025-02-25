import { Router } from 'express';
import FileController from '../controllers/fileController';
import multer from 'multer';

const router = Router();

// Configuração do multer (supondo que você está usando multer para upload)
const upload = multer({ dest: 'uploads/' });

// Corrigir os nomes das funções de acordo com o controlador
router.get('/files', FileController.listFiles);  // Usando listFiles ao invés de getAll
router.post('/upload', upload.single('file'), FileController.uploadFile);  // Usando uploadFile ao invés de upload
router.get('/file/:name', FileController.getFile);  // Usando getFile ao invés de download
router.delete('/file/:name', FileController.deleteFile);  // Usando deleteFile ao invés de delete

export default router;
