import { Router } from "express";
import {upload} from "../helpers/digitaloceanSpaces/configMulter";

const router = Router();

//controllers
import creatorControl from '../controllers/creator.controllers';

//middlewares

router.post('/createnotice',upload.fields([{name:"head",maxCount:1},{name:"files",maxCount:8}]),creatorControl.createNotice);

router.put("/filed",creatorControl.filedNew);

router.put("/changetitle",creatorControl.changeTitle);

router.put("/changesubsection",creatorControl.changeSubsection)

router.put("/changesection",creatorControl.changeSection)

router.put("/changedescription",creatorControl.changeDescription);

router.put("/changetags",creatorControl.changeTags);


router.put("/changeimagehead",upload.fields([{name:"head",maxCount:1}]),creatorControl.changeImagehead)

router.put("/changedescimage",creatorControl.changeDescImage)

router.put("/togglesubsneed",creatorControl.toggleSubsneed)

router.put("/changelanguage",creatorControl.changeLocale)

router.put("/changecontent",upload.fields([{name:"image",maxCount:1}]),creatorControl.changeContents)

router.put("/deletecontent",creatorControl.deleteContents)

export default router;

