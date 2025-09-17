function SignUp({onLogin}){
    return (
        <div style={{maxWidth: '300px', margin: '0 auto'}}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label><br/>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div style={{marginTop: '10px'}}>
                    <label>Passwort:</label><br/>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" style={{marginTop: '15px'}}>
                    Einloggen
                </button>
            </form>
            <div id="message"></div>
        </div>
    )
}

export default SignUp;