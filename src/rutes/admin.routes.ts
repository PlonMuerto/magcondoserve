import { Router } from "express";
import Multer from 'multer'

const upload = Multer({dest:'files/'});


const router = Router();

//controllers
import adminControlls from '../controllers/admin.controllers';

//middleware

//login admin
router.post('/loginadmin',adminControlls.loginAdmin);

//users - borrar usuario
router.delete('/deleteuser',adminControlls.deleteUser);

//users - actualizar usuario
router.put('/upgraderoleuser',adminControlls.upgradeRole);

//users - subscribir usuario
router.put('/subscribeuser',adminControlls.subscribedUser);

//users - bloquear usuario
router.put('/blockuser',adminControlls.lockedUser);

//sections - crear section
router.post('/createsection',adminControlls.createSection);

//sections - archivar section
router.put('/filedsection',adminControlls.filedSection);

//sections - crear subsection
router.put('/addsubsection',adminControlls.addSubSection);

//sections - borrar subsection
router.delete('/deletesubsection',adminControlls.pullSubsection);

//sections - update
router.put('/updatesection',adminControlls.updateSection);

export default router