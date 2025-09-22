import VotingImagesOverview from "../components/VotingImagesOverview.jsx";
import {useState} from "react";

function Voting(){
    // voting-object wird per API-call angefragt und dann erstellt
    // Zum Testen wird es hier hart gecoded
    const [voting, setVoting] = useState([
        {name: "Jan H.", image: "../../dev-assets/test_img_001.jpg", points: 0},
        {name: "Koray", image: "../../dev-assets/test_img_002.jpg", points: 0},
        {name: "Ruben", image: "../../dev-assets/test_img_007.jpg", points: 0},
        {name: "Nils", image: "../../dev-assets/test_img_003.jpg", points: 0},
        {name: "Lucas", image: "../../dev-assets/test_img_005.jpg", points: 0},
        {name: "Felix", image: "../../dev-assets/test_img_006.jpg", points: 0}
    ]);
    const [pointsGiven, setPointsGiven] = useState([]);

    return (
        <div className="bg-gray-100 flex flex-1 flex-col justify-between items-center">
            <h1 className="font-bold p-5">Voting</h1>
            <div className="w-full h-full flex flex-col">
                <VotingImagesOverview voting={voting} setVoting={setVoting} pointsGiven={pointsGiven} setPointsGiven={setPointsGiven}/>
            </div>
        </div>
    )
}

export default Voting;