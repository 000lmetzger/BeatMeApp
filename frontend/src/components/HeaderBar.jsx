function headerBar( {username, profileImage} ){
    return (
        <nav style={{
            backgroundColor: '#006',
            minWidth: '100vw',
            minHeight: '12vh',
            fontSize: '200%',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div>{username}</div>
        </nav>
    );
}

export default headerBar;