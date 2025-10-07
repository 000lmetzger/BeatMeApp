function VotingCard({ user }) {
    return (
        <div
            className={"w-full border-2 rounded overflow-hidden transition-opacity"}
        >
            <div className="p-2 font-semibold">{user.name}</div>

            <div className="w-full h-48 relative flex justify-center items-center bg-gray-200">
                <img
                    src={user.image}
                    alt="No image provided"
                    className={`w-full h-full object-cover transition-opacity ${user.points === 0 ? "opacity-100" : "opacity-30"}`}
                />
                {user.points !== 0 && (
                <div className="absolute h-[100%] w-[100%] flex justify-center items-center">
                    <div
                        className="p-2 border rounded-2xl"
                        style={{
                            backgroundColor:
                                user.points === 1
                                    ? "#e8812c"
                                    : user.points === 2
                                        ? "silver"
                                        : "gold",
                        }}
                    >
                        {user.points} {user.points === 1 ? "Point" : "Points"}
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}

export default VotingCard;
