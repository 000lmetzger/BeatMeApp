import { useState } from "react";
import VotingCard from "./VotingCard.jsx";

function VotingImagesOverview({ voting, setVoting, pointsGiven, setPointsGiven }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleCardClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const voted = (selected_user, points) => {
        let new_voting_obj = [];
        let adjust_user = {};
        for (const u of voting){
            if(u.name === selected_user.name){
                adjust_user.name = selected_user.name;
                adjust_user.image = selected_user.image;
                adjust_user.points = points;
                new_voting_obj.push(adjust_user);
            }
            else{
                new_voting_obj.push(u);
            }
        }
        setPointsGiven([...pointsGiven, points]);
        setVoting(new_voting_obj);
        setIsModalOpen(false);
    }

    return (
        <div className="flex-1 overflow-y-auto min-h-0 w-full p-4 pb-20">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {voting && voting.length > 0 ? (
                    voting.map((item, index) => (
                        <div key={item.id ?? index} onClick={() => handleCardClick(item)}>
                            <VotingCard user={item}/>
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
                        <h2 className="font-bold text-lg text-center">{selectedUser.name}</h2>
                        <img
                            src={selectedUser.image}
                            alt={selectedUser.name}
                            className="mt-4 rounded-lg w-full"
                        />
                        <div className="mt-5 mb-2">Vote for this image:</div>
                        <div className="flex flex-row justify-between">
                            <button
                                style={{ backgroundColor: "gold" }}
                                onClick={() => voted(selectedUser, 3)}
                                disabled={pointsGiven.includes(3)}
                                className={`p-2 rounded text-white font-bold transition-opacity duration-200 ${
                                    pointsGiven.includes(3) ? "opacity-0 cursor-not-allowed" : "hover:opacity-90"
                                }`}
                            >
                                3<br />Points
                            </button>

                            <button
                                style={{ backgroundColor: "silver" }}
                                onClick={() => voted(selectedUser, 2)}
                                disabled={pointsGiven.includes(2)}
                                className={`p-2 rounded text-white font-bold transition-opacity duration-200 ${
                                    pointsGiven.includes(2) ? "opacity-0 cursor-not-allowed" : "hover:opacity-90"
                                }`}
                            >
                                2<br />Points
                            </button>

                            <button
                                style={{ backgroundColor: "#e8812c" }}
                                onClick={() => voted(selectedUser, 1)}
                                disabled={pointsGiven.includes(1)}
                                className={`p-2 rounded text-white font-bold transition-opacity duration-200 ${
                                    pointsGiven.includes(1) ? "opacity-0 cursor-not-allowed" : "hover:opacity-90"
                                }`}
                            >
                                1<br />Point
                            </button>


                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VotingImagesOverview;
