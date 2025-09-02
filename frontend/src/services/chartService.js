// chartService.js
import { getTrips } from "./tripService";

// Trips by destination
export const getTripsByDestination = async (token) => {
    const trips = await getTrips(token);

    const grouped = trips.reduce((acc, trip) => {
        acc[trip.destination] = (acc[trip.destination] || 0) + 1;
        return acc;
    }, {});

    return {
        labels: Object.keys(grouped),
        datasets: [
            {
                label: "Trips by Destination",
                data: Object.values(grouped),
                backgroundColor: "rgba(59, 130, 246, 0.7)", // Tailwind blue-500
                borderColor: "rgba(59, 130, 246, 1)",
                borderWidth: 1,
            },
        ],
    };
};

// Trips by month
export const getTripsByMonth = async (token) => {
    const trips = await getTrips(token);

    const grouped = trips.reduce((acc, trip) => {
        const month = new Date(trip.date).toLocaleString("default", {
            month: "short",
            year: "numeric",
        });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});

    return {
        labels: Object.keys(grouped),
        datasets: [
            {
                label: "Trips by Month",
                data: Object.values(grouped),
                backgroundColor: "rgba(16, 185, 129, 0.7)", // Tailwind emerald-500
                borderColor: "rgba(16, 185, 129, 1)",
                borderWidth: 1,
            },
        ],
    };
};
