import { Alert } from '../models/Alert.js';


export async function listAlerts(req, res) {
    const items = await Alert.find({ userId: req.user.id }).sort('-occurredAt').limit(500);
    res.json(items);
}


export async function createAlert(req, res) {
    const a = await Alert.create({ ...req.body, userId: req.user.id });
    res.status(201).json(a);
}


export async function updateAlert(req, res) {
    const a = await Alert.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    if (!a) return res.status(404).json({ message: 'Not found' });
    res.json(a);
}


export async function deleteAlert(req, res) {
    const out = await Alert.deleteOne({ _id: req.params.id, userId: req.user.id });
    if (!out.deletedCount) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
}