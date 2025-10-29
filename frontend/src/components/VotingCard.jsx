import { useGroup } from "../context/GroupContext.jsx";

function VotingCard({ user }) {
    const { group } = useGroup();

    const uidToUsername = (uid) => {
        const member = group.members.find((m) => m.uid === uid);
        return member ? member.username : "No username";
    };

    return (
        <div className="rounded-2xl p-[2px] bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#a855f7] shadow-lg">
            <div className="w-full rounded-[14px] overflow-hidden bg-white/90 backdrop-blur-xl border border-white/40">
                <div className="px-3 py-2 font-semibold text-gray-900 flex items-center justify-between">
                    <span>{uidToUsername(user.uid)}</span>
                </div>

                <div className="w-full h-48 relative flex justify-center items-center bg-gray-100">
                    <img
                        src={user.url}
                        alt="No image provided"
                        className={`w-full h-full object-cover transition-opacity ${
                            user.points === 0 ? "opacity-100" : "opacity-40"
                        }`}
                    />

                    {user.points !== 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className="px-4 py-2 rounded-full text-white font-bold text-lg shadow-xl border border-white/30 backdrop-blur-md"
                                style={{
                                    background:
                                        user.points === 1
                                            ? "linear-gradient(135deg,#f59e0b,#ea580c)"
                                            : user.points === 2
                                                ? "linear-gradient(135deg,#d1d5db,#6b7280)"
                                                : "linear-gradient(135deg,#fde68a,#f59e0b)",
                                }}
                            >
                                {user.points} {user.points === 1 ? "Point" : "Points"}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VotingCard;