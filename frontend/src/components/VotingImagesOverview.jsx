import { useState } from "react";
import VotingCard from "./VotingCard.jsx";
import {useGroup} from "../context/GroupContext.jsx";

function VotingImagesOverview({ pointsGiven, setPointsGiven, imageData, setImageData }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { group } = useGroup();

    const handleCardClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const uidToUsername = (uid) => {
        for (let user of group.members){
            if (user.uid === uid) return user.username;
        }
        return "No username";
    }

    const changeOrderOfImages = (v) => {
        return v.sort((a, b) => b.points - a.points);
    }

    const voted = (selected_user, points) => {
        let new_voting_obj = [];
        let adjust_user = {};
        for (const u of imageData){
            if(u.uid === selected_user.uid){
                adjust_user.uid = selected_user.uid;
                adjust_user.url = selected_user.url;
                adjust_user.points = points;
                new_voting_obj.push(adjust_user);
            }
            else{
                new_voting_obj.push(u);
            }
        }
        setPointsGiven([...pointsGiven, points]);
        setImageData(new_voting_obj);
        setIsModalOpen(false);
    }

    return (
        <div className="flex-1 overflow-y-auto min-h-0 w-full p-4 pb-20">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {imageData && imageData.length > 0 ? (
                    changeOrderOfImages(imageData).map((item, index) => (
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
                        <h2 className="font-bold text-lg text-center">{uidToUsername(selectedUser.uid)}</h2>
                        <img
                            src={selectedUser.url}
                            alt={uidToUsername(selectedUser.uid)}
                            className="mt-4 rounded-lg w-full"
                        />
                        <div className="mt-5 mb-2">{((selectedUser.points === 2)||(selectedUser.points === 3)) ? <p>You have already voted: {selectedUser.points} Points</p> : (selectedUser.points === 1) ? <p>Vote for this image: 1 Point </p> : (pointsGiven.length >= 3) ? <p>Voting completed</p> : <p>Vote for this image:</p>}</div>
                        <div className="flex flex-row justify-between">
                            <button
                                style={{ backgroundColor: "gold" }}
                                onClick={() => voted(selectedUser, 3)}
                                disabled={pointsGiven.includes(3) || (selectedUser.points !== 0)}
                                className={`p-2 rounded text-white font-bold transition-opacity duration-200 ${
                                    (pointsGiven.includes(3) || (selectedUser.points !== 0)) ? "opacity-0 cursor-not-allowed" : "hover:opacity-90"
                                }`}
                            >
                                3<br />Points
                            </button>

                            <button
                                style={{ backgroundColor: "silver" }}
                                onClick={() => voted(selectedUser, 2)}
                                disabled={pointsGiven.includes(2) || (selectedUser.points !== 0)}
                                className={`p-2 rounded text-white font-bold transition-opacity duration-200 ${
                                    (pointsGiven.includes(2) || (selectedUser.points !== 0)) ? "opacity-0 cursor-not-allowed" : "hover:opacity-90"
                                }`}
                            >
                                2<br />Points
                            </button>

                            <button
                                style={{ backgroundColor: "#e8812c" }}
                                onClick={() => voted(selectedUser, 1)}
                                disabled={pointsGiven.includes(1) || (selectedUser.points !== 0)}
                                className={`p-2 rounded text-white font-bold transition-opacity duration-200 ${
                                    (pointsGiven.includes(1) || (selectedUser.points !== 0)) ? "opacity-0 cursor-not-allowed" : "hover:opacity-90"
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
