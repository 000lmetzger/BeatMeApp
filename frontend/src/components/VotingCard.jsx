import { useGroup } from "../context/GroupContext.jsx";

function VotingCard({ user }) {
    const { group } = useGroup();

    const uidToUsername = (uid) => {
        const member = group.members.find((m) => m.uid === uid);
        return member ? member.username : "No username";
    };

    return (
        <div className="w-full border-2 rounded overflow-hidden transition-opacity relative">
            {user.points !== 0 && (
                <div className="absolute top-2 left-2 px-3 py-1 rounded-full font-bold text-white"
                     style={{
                         backgroundColor:
                             user.points === 1 ? "#e8812c" :
                                 user.points === 2 ? "silver" :
                                     "gold",
                     }}>
                    {user.points} {user.points === 1 ? "Point" : "Points"}
                </div>
            )}

            <div className="p-2 font-semibold">{uidToUsername(user.uid)}</div>

            <div className="w-full h-48 relative flex justify-center items-center bg-gray-200">
                <img
                    src={user.url}
                    alt="No image provided"
                    className={`w-full h-full object-cover transition-opacity ${
                        user.points === 0 ? "opacity-100" : "opacity-30"
                    }`}
                />
            </div>
        </div>
    );
}

export default VotingCard;
