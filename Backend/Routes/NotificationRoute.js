const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/auth');
const {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification
} = require('../Controllers/NotificationCtrl');

router.post('/', createNotification);
router.get('/', auth, getNotifications);
router.get('/:id', getNotificationById);
router.put('/:id', auth, updateNotification);
router.delete('/:id', auth, deleteNotification);

module.exports = router;