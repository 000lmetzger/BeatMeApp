import { useState } from 'react';
import { API_URL } from '../config/config.js';
import {Link} from "react-router-dom";

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(API_URL + "/loginUser", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data === false){
                    document.getElementById("message").innerText = "Email oder Passwort nicht gültig";
                }
                else{
                    onLogin();
                }
            }
        } catch (err) {
            setError('Login fehlgeschlagen. Bitte prüfe deine Eingaben.');
        }
    };

    return (
        <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            <h1 style={{ margin: '0', padding: '10vw' }}>Beat Me</h1>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '80%'}}
                    />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label>Passwort:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '80%'}}
                    />
                </div>
                <div style={{ display:'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>

                    <button type="submit" style={{marginTop: '15px', backgroundColor: 'blue', color: 'white'}}>
                        Einloggen
                    </button>
                </div>
            </form>
            <div id="message"></div>
        </div>
    );
}

export default Login;
