import { Router } from 'express';
import multer from 'multer';
import {
  downloadProfile,
  getUserAndProfile,
  getUserProfileAndUserBasedOnUsername,
  login,
  register,
  sendConnectionRequest,
  whatAreMyConnections,
  uploadProfilePicture,
  updateUserProfile,
  updateProfileData,
  getAllUserProfile,
  acceptConnectionRequest,
  getMyConnectionsRequest
} from '../controllers/user.controller.js';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Profile management
router.post("/upload_profile_picture", upload.single('profilePicture'), uploadProfilePicture);
router.post('/register', register);
router.post('/login', login);
router.post('/user_update', updateUserProfile);
router.get('/get_user_and_profile', getUserAndProfile);
router.post('/update_profile_data', updateProfileData);
router.get('/user/get_all_users', getAllUserProfile);
router.get("/user/download_resume", downloadProfile);
router.get("/user/get_profile_based_on_username", getUserProfileAndUserBasedOnUsername);

// Connection management
router.post("/user/send_connection_request", sendConnectionRequest);
router.get("/user/get_sent_requests", getMyConnectionsRequest);

router.get("/user/get_received_requests", whatAreMyConnections);

router.get("/user/get_connections", whatAreMyConnections);

router.post("/user/accept_connection_request", acceptConnectionRequest);

export default router;



