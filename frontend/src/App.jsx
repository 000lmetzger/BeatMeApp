import { useState } from 'react';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <div style={{
            backgroundImage: 'linear-gradient(to bottom, rgb(232, 249, 255), rgb(172, 255, 252))',
            minHeight: '100vh',
            minWidth: '100vw'
        }}>
            {!loggedIn && <Login onLogin={() => setLoggedIn(true)} />}
            {loggedIn && <Home />}
        </div>
    );
}

export default App;