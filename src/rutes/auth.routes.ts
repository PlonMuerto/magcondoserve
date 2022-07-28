import { Router } from "express";
import Multer from 'multer'

const upload = Multer({dest:'files/'});

const router = Router();

//controller
import authControllers from '../controllers/auth.controllers';


//unique authentication for admins and editors
router.post('/login',authControllers.login);

export default router