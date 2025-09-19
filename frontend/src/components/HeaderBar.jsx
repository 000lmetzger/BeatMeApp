function HeaderBar({ username, profileImage }) {
    return (
        <nav
            className="sticky top-0 z-50 bg-[#006] text-white flex justify-center items-center shadow-md"
            style={{
                minHeight: "12vh",
                fontSize: "200%",
            }}
        >
            <div>{username}</div>
        </nav>
    );
}

export default HeaderBar;
