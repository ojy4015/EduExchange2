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
router.post("/access-account", authController.accessAccount);
// router.get("/refresh-token", authController.refreshToken);
router.patch('/resetPassword/:token', authController.resetPassword);
// get anyuser without logged in
router.get('/profile/:username', authController.publicProfile);

// show all agents
router.get("/agents", userController.agents);
// how many properties each agent created, _id: agent's id
router.get("/agent-ad-count/:_id", userController.agentAdCount);
// show each agent's info, username: agent's usernames
router.get('/agent/:username', userController.agent);


// Protect all routes after this middleware 
router.use(authController.protect);

// orders
router.get("/orders", userController.getOrders);

// update name, address
router.put(
  '/profile',
  authController.updateProfile
);

// if someone is logged in
router.get("/current-user", authController.currentUser);

// update password for logged user
router.patch(
  '/updateMyPassword',
  authController.updatePassword
);

// get currently logged-in user from MongoDB
router.get('/me',
  userController.getMe,
  userController.getUser
);

// router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);


// only admin do these
router.use(authController.restrictTo('admin'));

router.get("/admin-check", authController.currentUser);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/all-orders')
  .get(userController.getAllOrders);


router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
