import { Router } from "express";
import Multer from 'multer'

const upload = Multer({dest:'files/'});

const router = Router();

//controllers
import creatorControl from '../controllers/creator.controllers';

//middlewares


router.post('/logincreator',creatorControl.loginCreator);

router.post('/createnotice',creatorControl.createNotice);

router.put('/editnotice',creatorControl.editNotice);

router.delete('/deletenotice',creatorControl.deleteNotice);

export default router;

