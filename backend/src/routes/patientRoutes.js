import express from 'express';
import Patient from '../models/Patient.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all patients for logged-in user
router.get('/', auth, async (req, res) => {
  const patients = await Patient.find({ createdBy: req.user.id });
  res.json(patients);
});

// Add new patient
router.post('/', auth, async (req, res) => {
  const { name, phone, disease } = req.body;
  if (!name || !phone || !disease)
    return res.status(400).json({ message: 'All fields required' });
  const patient = await Patient.create({
    name, phone, disease, createdBy: req.user.id
  });
  res.json(patient);
});

export default router;
