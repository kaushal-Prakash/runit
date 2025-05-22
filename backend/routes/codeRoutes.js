import express from 'express';
import { getCode, uploadCode } from '../controllers/CodeController.js';
const router = express.Router();

router.post('/upload', uploadCode);
router.get('/get/:room', getCode);

export default router;