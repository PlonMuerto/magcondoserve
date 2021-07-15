import { Router } from "express";

const router = Router();

//import rutes
import adminRoutes from "./admin.routes";
import creatorRouter from "./creator.routes";
import authRouter from './auth.routes';

//import middlewares
import adminMiddleware from '../middleware/admin.middleware';
import creatorMiddleware from '../middleware/creator.middleware';
import authMiddleware from '../middleware/auth.middleware';

router.use('/auth',authRouter);

router.use('/creator',authMiddleware,creatorMiddleware,creatorRouter);

router.use('/admin',authMiddleware,adminMiddleware,adminRoutes);

export default router;