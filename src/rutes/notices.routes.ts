import { Router } from "express";


const router = Router();

//controllers
import noticesControl from '../controllers/notices.controllers';

//middlewares

router.get('/getnotice/:id?',noticesControl.getNotice);

export default router;

