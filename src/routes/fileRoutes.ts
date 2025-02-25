// /src/routes/fileRoutes.ts
import { Router } from 'express';
import FileController from '../controllers/fileController';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });  // A Multer ainda será necessária para o processo de upload temporário

router.get('/files', FileController.getAll);  // Rota para listar arquivos
router.post('/files/upload', upload.single('file'), FileController.upload);  // Rota de upload de arquivo
router.get('/files/:name', FileController.download);  // Rota de download de arquivo
router.delete('/files/:name', FileController.delete);  // Rota de exclusão de arquivo

export default router;
