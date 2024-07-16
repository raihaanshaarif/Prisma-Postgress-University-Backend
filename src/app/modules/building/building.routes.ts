import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingController } from './building.controlelr';
import { BuildingValidation } from './building.validation';

const router = express.Router();

router.get('/', BuildingController.getFromDB);
router.get('/:id', BuildingController.getByIdFromDB);

router.post(
  '/',
  validateRequest(BuildingValidation.create),
  BuildingController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(BuildingValidation.update),
  //   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BuildingController.updateOneInDB
);

router.delete(
  '/:id',
  //   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BuildingController.deleteByIdFromDB
);

export const BuildingRoutes = router;
