import { useState } from 'react';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <div>
            {!loggedIn && <Login onLogin={() => setLoggedIn(true)} />}
            {loggedIn && <Home />}
        </div>
    );
}

export default App;