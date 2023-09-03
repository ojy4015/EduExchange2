//////////////////////////////////////////////////////////////////////////////
import express from 'express';
import * as userController from './../controllers/userController.js';
import * as authController from './../controllers/authController.js';

const router = express.Router();

// for public
router.post('/pre-signup', authController.preSignup);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware 
router.use(authController.protect);

// update name, address
router.put(
  '/profile',
  authController.updateProfile
);


router.get("/auth-check", (req, res) => {
  res.json({ ok: true });
});

// update password for logged user
router.patch(
  '/updateMyPassword',
  authController.updatePassword
);

router.get('/me',
  userController.getMe,
  userController.getUser
);

// router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);


// only admin do these
router.use(authController.restrictTo('admin'));

router.get("/admin-check", (req, res) => {
  res.json({ ok: true });
});

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
