import express from 'express';
import { addBorrowLend, getAllBorrowLend, updateBorrowLend, deleteBorrowLend } from '../controllers/borrowLendController.js';
import auth from '../middlewares/auth.js';


const router = express.Router();

router.use(auth);

router.post("/", addBorrowLend);
router.get("/", getAllBorrowLend);
router.put("/:id", updateBorrowLend);
router.delete("/:id", deleteBorrowLend);

export default router;
