import {FaCamera, FaUpload} from "react-icons/fa";

function Ranking( { group }){
    return (
        <div className="bg-gray-100 flex pb-[20%] flex-1 flex-col justify-between items-center p-5">
            <h1 className="font-bold p-5">Ranking</h1>
            <div className="w-full h-full flex flex-col">
                <div className="flex flex-row justify-between">
                    <div>Name</div>
                    <div>Points</div>
                </div>
                <div className="flex flex-col justify-start">
                    {group.ranking && group.ranking.map((item, index) => (
                            <div key={index} className="p-4 mb-2 bg-white rounded flex flex-row justify-between">
                                <p>{item.name}</p>
                                <p>{item.score}</p>
                            </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Ranking;