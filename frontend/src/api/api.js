import axios from "axios";

//base url of backend
const API = axios.create({
    baseURL: 'https://car-safety-systems.onrender.com/api',
    headers: {
    'Content-Type':'application/json',
    },
});
// add JWT token automatically if stored
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

//Auth
export const loginUser = (data) => API.post('/users/login', data);
export const registerUser = (data) => API.post('/users/register', data);
//vehicles
export const getVehicles = () => API.get('/vehicles');
export const addVehicle = (vehicle) => API.post('/vehicles', vehicle);
export const updateVehicle = (id, vehicle) => API.post(`/vehicles/${id}`, vehicle);
export const deleteVehicle = (id) => API.delete(`/vehicles/${id}`);


//admin
export const getAllUsers = () => API.get('/users');
export const deleteUser = (id) => API.delete(`/users/${id}`);
export default API