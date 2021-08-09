import { Router } from "express";
import {upload} from "../helpers/digitaloceanSpaces/configMulter";

const router = Router();

//controllers
import creatorControl from '../controllers/creator.controllers';

//middlewares



router.post('/logincreator',creatorControl.loginCreator);

router.post('/createnotice',upload.fields([{name:"head",maxCount:1},{name:"files",maxCount:8}]),creatorControl.createNotice);

router.put('/editnotice',creatorControl.editNotice);

router.delete('/deletenotice',creatorControl.deleteNotice);

export default router;

