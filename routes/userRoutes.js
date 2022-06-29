import express from 'express';
import {  loggedUser, login, resetForgotPasswordEmail, resetPassword, sendForgotPasswordEmail,  signup } from '../controller/userController.js';
import { checkUserAuth } from '../middleware/authMiddleware.js';


const router=express.Router();



//middleware
router.use('/resetpassword',checkUserAuth)


router.post('/signup',signup);
router.post('/login',login);

router.post('/forgotpassword',sendForgotPasswordEmail);
router.post('/resetforgotpassword/:id/:token',resetForgotPasswordEmail);

router.get('/loggeduser',loggedUser)



//protected routes for user
router.post('/resetpassword',resetPassword)





export default router;