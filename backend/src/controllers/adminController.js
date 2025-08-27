import { User } from '../models/User.js';
import { Vehicle } from '../models/Vehicle.js';
import { Trip } from '../models/Trip.js';
import { Alert } from '../models/Alert.js';


export async function stats(req, res) {
    const [users, vehicles, trips, alerts] = await Promise.all([
        User.countDocuments(), Vehicle.countDocuments(), Trip.countDocuments(), Alert.countDocuments()
    ]);


    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentTrips = await Trip.aggregate([
        { $match: { startTime: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);


    const alertsByType = await Alert.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $project: { type: '$_id', count: 1, _id: 0 } }
    ]);


    res.json({ users, vehicles, trips, alerts, recentTrips, alertsByType });
}