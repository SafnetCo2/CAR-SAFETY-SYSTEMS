import { Vehicle } from '../models/Vehicle.js';


export async function listVehicles(req, res) {
    const items = await Vehicle.find({ userId: req.user.id }).sort('-createdAt');
    res.json(items);
}


export async function createVehicle(req, res) {
    const v = await Vehicle.create({ ...req.body, userId: req.user.id });
    res.status(201).json(v);
}


export async function updateVehicle(req, res) {
    const v = await Vehicle.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    if (!v) return res.status(404).json({ message: 'Not found' });
    res.json(v);
}


export async function deleteVehicle(req, res) {
    const out = await Vehicle.deleteOne({ _id: req.params.id, userId: req.user.id });
    if (!out.deletedCount) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
}