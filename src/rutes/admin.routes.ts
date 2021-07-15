import { Router } from "express";
import Multer from 'multer'

const upload = Multer({dest:'files/'});

const router = Router();


//middleware

router.post('/loginadmin');
router.delete('/deleteuser');
router.put('/upgraderoleuser');
router.delete('/deletenotice');
router.post('/createsection');
router.delete('/deletesection');
router.put('/subscribeUser');

export default router