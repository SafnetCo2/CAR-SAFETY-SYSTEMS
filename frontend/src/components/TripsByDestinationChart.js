// TripsByDestinationChart.jsx
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getTripsByDestination } from "../services/chartService";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TripsByDestinationChart({ token }) {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getTripsByDestination(token);
            setChartData(data);
        };
        fetchData();
    }, [token]);

    if (!chartData) return <p>Loading chart...</p>;

    return (
        <div className="w-full p-4 bg-white shadow rounded-2xl">
            <h2 className="text-lg font-semibold mb-4">Trips by Destination</h2>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>
    );
}
