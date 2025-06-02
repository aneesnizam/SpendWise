import express from 'express'
import authMiddleware from '../middlewares/auth.js';
import { getUser, updateUser } from '../controllers/userController.js';


const router = express.Router();

router.use(authMiddleware);

router.get("/", getUser)
router.post("/", updateUser)

export default router;