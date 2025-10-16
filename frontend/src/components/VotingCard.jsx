import { useGroup } from "../context/GroupContext.jsx";

function VotingCard({ user }) {
    const { group } = useGroup();

    const uidToUsername = (uid) => {
        const member = group.members.find((m) => m.uid === uid);
        return member ? member.username : "No username";
    };

    return (
        <div className="w-full border-2 rounded overflow-hidden transition-opacity relative">
            <div className="p-2 font-semibold">{uidToUsername(user.uid)}</div>

            <div className="w-full h-48 relative flex justify-center items-center bg-gray-200">
                <img
                    src={user.url}
                    alt="No image provided"
                    className={`w-full h-full object-cover transition-opacity rounded ${
                        user.points === 0 ? "opacity-100" : "opacity-40"
                    }`}
                />

                {user.points !== 0 && (
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div
                            className="px-4 py-2 rounded-full text-white font-bold text-lg shadow-lg"
                            style={{
                                backgroundColor:
                                    user.points === 1
                                        ? "#e8812c"
                                        : user.points === 2
                                            ? "silver"
                                            : "gold",
                                backdropFilter: "blur(6px)",
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
