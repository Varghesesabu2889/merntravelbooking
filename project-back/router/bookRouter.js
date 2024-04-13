// bookingRoutes.js
import express from 'express';
import { createBooking, getBookingById, getAllBookings } from '../controllers/bookingController.js';
import { verifyAdmin, verifyUser } from '../utlity/verifyToken.js';

const router = express.Router();

router.post('/',verifyAdmin, createBooking);
router.get('/:id',verifyUser, getBookingById);
router.get('/',verifyAdmin,verifyUser, getAllBookings);

export default router;
