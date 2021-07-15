import { Router } from "express";
import Multer from 'multer'

const upload = Multer({dest:'files/'});

const router = Router();

//controller
import authControllers from '../controllers/auth.controllers';

router.post('/login',authControllers.login);
router.post('/register',authControllers.register);

export default router