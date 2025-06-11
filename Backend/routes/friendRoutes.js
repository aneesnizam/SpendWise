import express from 'express';
import { acceptRequest, deleteFriend, getInbox, myFriendsData, rejectRequest, sendRequest, sentPayment } from '../controllers/friendController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);


router.post("/:email", sendRequest);
router.post("/accept/:id", acceptRequest) 
router.post("/reject/:id", rejectRequest)
router.delete("/:id", deleteFriend)
router.get("/me", myFriendsData)
router.post("/inbox/send/:id", sentPayment)
router.get("/inbox/get", getInbox)

export default router;