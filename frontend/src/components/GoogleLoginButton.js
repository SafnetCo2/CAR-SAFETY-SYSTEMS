import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function GoogleLoginButton() {
    const { loginUser } = useContext(AuthContext);

    const handleSuccess = async (response) => {
        try {
            const googleToken = response.credential; // ID token
            const res = await API.post('/users/google-login', { googleToken });
            loginUser(res.data, res.data.token); // store user and JWT
            alert(`Welcome, ${res.data.email}`);
        } catch (err) {
            console.error(err);
            alert('Google login failed');
        }
    };

    const handleError = () => {
        alert('Google login error');
    };

    return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />;
}
