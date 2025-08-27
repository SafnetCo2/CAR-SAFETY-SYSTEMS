import { Trip } from '../models/Trip.js';
import { Alert } from '../models/Alert.js';


export async function listTrips(req, res) {
    const items = await Trip.find({ userId: req.user.id }).sort('-startTime');
    res.json(items);
}


export async function createTrip(req, res) {
    const trip = await Trip.create({ ...req.body, userId: req.user.id });
    // Placeholder for safety rules (Phase 2). Optionally create alerts here.
    res.status(201).json({ trip });
}


export async function updateTrip(req, res) {
    const t = await Trip.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    if (!t) return res.status(404).json({ message: 'Not found' });
    res.json(t);
}


export async function deleteTrip(req, res) {
    const out = await Trip.deleteOne({ _id: req.params.id, userId: req.user.id });
    if (!out.deletedCount) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
}