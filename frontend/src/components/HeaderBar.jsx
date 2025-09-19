function HeaderBar({ user, profileImage }) {
    return (
        <nav
            className="sticky top-0 z-50 bg-[#006] text-white flex justify-center items-center shadow-md"
            style={{
                minHeight: "12vh",
                fontSize: "200%",
            }}
        >
            <div>{user?.name || "Guest"}
            </div>
        </nav>
    );
}

export default HeaderBar;
