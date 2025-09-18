import { useState } from 'react';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import { LoginForm } from "./pages/login-form"

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    /*
    return (
        <div style={{
            backgroundImage: 'linear-gradient(to bottom, rgb(232, 249, 255), rgb(172, 255, 252))',
            minHeight: '100vh',
            minWidth: '100vw'
        }}>
            {!loggedIn && <Login onLogin={() => setLoggedIn(true)} />}
            {loggedIn && <Home />}
        </div>
    );*/
      return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      )

}

export default App;