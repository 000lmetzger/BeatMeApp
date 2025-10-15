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

        const result = await vote(
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
        <div className="flex-1 overflow-y-auto min-h-0 w-full p-4 pb-20">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {localImageData.length > 0 ? (
                    changeOrderOfImages(localImageData).map((item, index) => (
                        <div key={item.id ?? index} onClick={() => handleCardClick(item)}>
                            <VotingCard user={item} />
                        </div>
                    ))
                ) : (
                    <p className="col-span-2 text-center">No images provided</p>
                )}
            </div>

            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-2xl p-6 w-11/12 max-w-lg relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold"
                        >
                            ✕
                        </button>
                        <h2 className="font-bold text-lg text-center">{uidToUsername(selectedUser.uid)}</h2>
                        <img
                            src={selectedUser.url}
                            alt={uidToUsername(selectedUser.uid)}
                            className="mt-4 rounded-lg w-full"
                        />
                        <div className="mt-5 mb-2">
                            {selectedUser.points > 0 ? (
                                <p>
                                    You have already voted: {selectedUser.points}{" "}
                                    {selectedUser.points === 1 ? "Point" : "Points"}
                                </p>
                            ) : (
                                <p>Vote for this image:</p>
                            )}
                        </div>

                        <div className="flex flex-row justify-between">
                            {availablePoints.includes(3) && (
                                <button
                                    style={{ backgroundColor: "gold" }}
                                    onClick={() => handleVote(3)}
                                    className="p-2 rounded text-white font-bold hover:opacity-90 transition-opacity duration-200"
                                >
                                    3<br />Points
                                </button>
                            )}

                            {availablePoints.includes(2) && (
                                <button
                                    style={{ backgroundColor: "silver" }}
                                    onClick={() => handleVote(2)}
                                    className="p-2 rounded text-white font-bold hover:opacity-90 transition-opacity duration-200"
                                >
                                    2<br />Points
                                </button>
                            )}

                            {availablePoints.includes(1) && (
                                <button
                                    style={{ backgroundColor: "#e8812c" }}
                                    onClick={() => handleVote(1)}
                                    className="p-2 rounded text-white font-bold hover:opacity-90 transition-opacity duration-200"
                                >
                                    1<br />Point
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VotingImagesOverview;
