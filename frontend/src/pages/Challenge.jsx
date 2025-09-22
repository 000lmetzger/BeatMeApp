import {FaCamera, FaUpload} from "react-icons/fa";
import {useState} from "react";

function Challenge( {challenge} ){
    const [completed, setCompleted] = useState(false);

    return (
        <div className="bg-gray-100 flex pb-[25%] flex-1 flex-col justify-between items-center p-4">
            <h1 className="font-bold p-5">Challenge</h1>

            <h2 className="text-xl font-semibold mb-4">{challenge.header}</h2>

            <div className="bg-white shadow-md rounded-lg    p-6 mb-6 w-full max-w-md">
                <p className="text-gray-700">{challenge.description}
                </p>
            </div>

            {!completed ?
                <div className="flex flex-row justify-center items-center w-full space-x-4 border-1 h-[50%]">
                    <button className="flex flex-col items-center w-[45%] h-[50%] py-3 px-4 rounded-lg transition"
                            style={{backgroundColor: "#11ff11"}}>
                        <FaCamera /><br/>
                        Foto/Video aufnehmen
                    </button>
                    <button className="flex flex-col items-center w-[45%] h-[50%] py-3 px-4 rounded-lgtransition"
                            style={{backgroundColor: "#6666ff"}}
                            onClick={() => setCompleted(true)}>
                        <FaUpload /><br />
                        Hochladen
                    </button>
                </div>
                :
                <div className="flex flex-row justify-center items-center w-full space-x-4 border-1 h-[50%]">
                    Challenge done
                </div>
            }
        </div>
    )
}

export default Challenge;