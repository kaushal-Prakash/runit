import express from 'express';
import { getCode, runIt, uploadCode } from '../controllers/CodeController.js';
const router = express.Router();

router.post('/upload', uploadCode);
router.get('/get/:room', getCode);
router.post("/run", runIt)

export default router;