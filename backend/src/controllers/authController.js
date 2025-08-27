import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../config.js';


export async function register(req, res) {
    const { email, password, name, company } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
    const user = await User.create({ email, password, name, company });
    const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
    res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name } });
}


export async function login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name } });
}