import { useState, useEffect } from "react";
import VotingCard from "./VotingCard.jsx";
import { useGroup } from "../context/GroupContext.jsx";
import { useUser } from "../context/UserContext.jsx";

function VotingImagesOverview({ imageData, yesterdayChallenge, vote, votesData }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { group } = useGroup();
    const { user } = useUser();
    const [localImageData, setLocalImageData] = useState([]);

    const handleCardClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const uidToUsername = (uid) => {
        const member = group.members.find((m) => m.uid === uid);
        return member ? member.username : "No username";
    };

    const changeOrderOfImages = (v) => [...v].sort((a, b) => b.points - a.points);

    const updatePointsFromVotes = (images, votes) => {
        if (!votes || !images) return images;
        return images.map((img) => {
            if (votes.first === img.uid) return { ...img, points: 3 };
            if (votes.second === img.uid) return { ...img, points: 2 };
            if (votes.third === img.uid) return { ...img, points: 1 };
            return { ...img, points: img.points || 0 };
        });
    };

    useEffect(() => {
        const updated = updatePointsFromVotes(imageData, votesData);
        setLocalImageData(updated);
    }, [imageData, votesData]);

    const availablePoints = [3, 2, 1].filter(
        (p) => !localImageData.some((img) => img.points === p)
    );

    const handleVote = async (points) => {
        if (!selectedUser) return;
        const position = points === 3 ? "first" : points === 2 ? "second" : "third";

        await vote(
            yesterdayChallenge.challengeId,
            user.uid,
            selectedUser,
            position
        );

        setLocalImageData((prev) =>
            prev.map((img) =>
                img.uid === selectedUser.uid ? { ...img, points } : img
            )
        );

        setIsModalOpen(false);
    };

    return (
        <div className="flex-1 overflow-y-auto min-h-0 w-full p-4 pb-24">
            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {localImageData.length > 0 ? (
                    changeOrderOfImages(localImageData).map((item, index) => (
                        <div
                            key={item.id ?? index}
                            onClick={() => handleCardClick(item)}
                            className="rounded-2xl p-[2px] bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#a855f7] hover:shadow-xl transition-shadow"
                        >
                            <div className="rounded-[14px] overflow-hidden bg-white">
                                <VotingCard user={item} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-2 text-center text-gray-500">No images provided</p>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="w-11/12 max-w-lg relative rounded-2xl p-[2px] bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#a855f7] shadow-2xl">
                            <div className="bg-white/95 backdrop-blur-xl rounded-[14px] p-6">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-2 right-2 h-9 w-9 grid place-items-center rounded-full bg-black/5 hover:bg-black/10 text-gray-600"
                                    aria-label="Close"
                                >
                                    <span className="text-xl leading-none">×</span>
                                </button>

                                <h2 className="font-bold text-lg text-center text-gray-900">
                                    {uidToUsername(selectedUser.uid)}
                                </h2>

                                <img
                                    src={selectedUser.url}
                                    alt={uidToUsername(selectedUser.uid)}
                                    className="mt-4 rounded-xl w-full object-cover"
                                />

                                <div className="mt-5 mb-2">
                                    {selectedUser.points > 0 ? (
                                        <p className="text-center text-gray-700">
                                            You have already voted: {selectedUser.points}{" "}
                                            {selectedUser.points === 1 ? "Point" : "Points"}
                                        </p>
                                    ) : (
                                        <>
                                            <p className="text-center text-gray-700">Vote for this image:</p>
                                            <div className="mt-3 grid grid-cols-3 gap-3">
                                                {availablePoints.includes(3) && (
                                                    <button
                                                        style={{ background: "linear-gradient(135deg,#fde68a,#f59e0b)" }}
                                                        onClick={() => handleVote(3)}
                                                        className="p-2 rounded-xl text-white font-bold hover:opacity-90 transition-opacity duration-200 shadow"
                                                    >
                                                        <span className="text-base">3</span>
                                                        <br />
                                                        <span className="text-xs">Points</span>
                                                    </button>
                                                )}

                                                {availablePoints.includes(2) && (
                                                    <button
                                                        style={{ background: "linear-gradient(135deg,#e5e7eb,#6b7280)" }}
                                                        onClick={() => handleVote(2)}
                                                        className="p-2 rounded-xl text-white font-bold hover:opacity-90 transition-opacity duration-200 shadow"
                                                    >
                                                        <span className="text-base">2</span>
                                                        <br />
                                                        <span className="text-xs">Points</span>
                                                    </button>
                                                )}

                                                {availablePoints.includes(1) && (
                                                    <button
                                                        style={{ background: "linear-gradient(135deg,#fbbf24,#e8812c)" }}
                                                        onClick={() => handleVote(1)}
                                                        className="p-2 rounded-xl text-white font-bold hover:opacity-90 transition-opacity duration-200 shadow"
                                                    >
                                                        <span className="text-base">1</span>
                                                        <br />
                                                        <span className="text-xs">Point</span>
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VotingImagesOverview;