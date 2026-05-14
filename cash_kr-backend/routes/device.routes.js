import { Router } from 'express';
import { getBrands, getModels, getDeviceBySlug, calculatePrice } from '../controllers/device.controller.js';

const router = Router();

router.get('/brands', getBrands);
router.get('/models', getModels);
router.get('/:slug', getDeviceBySlug);
router.post('/calculate-price', calculatePrice);

export default router;
