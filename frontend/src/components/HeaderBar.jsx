function HeaderBar({ username, profilePicture }) {
    return (
        <nav
            className="sticky top-0 z-50 bg-[#006] text-white flex items-center justify-between px-4 shadow-md"
            style={{ minHeight: "12vh", fontSize: "200%" }}
        >
            <div className="w-1/3"></div>

            <div className="text-center w-1/3">
                {username || "Guest"}
            </div>

            <div className="w-1/3 flex justify-end">
                {profilePicture && (
                    <img
                        src={profilePicture}
                        alt="Profile"
                        className="h-15 w-15 rounded-full object-cover border-1 border-white"
                    />
                )}
            </div>
        </nav>
    );
}

export default HeaderBar;
