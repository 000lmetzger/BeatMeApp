import HeaderBar from "../components/HeaderBar.jsx";
import {useEffect, useState} from "react";
import PageBelowHeaderBar from "../components/PageBelowHeaderBar.jsx";
import {useNavigate} from "react-router-dom";
import DisplaySingleGroupInUserHome from "../components/DisplaySingleGroupInUserHome.jsx";
import {API_URL} from "../config/config.js";
import {useUser} from "../context/UserContext.jsx";

function Home() {
    const [groups, setGroups] = useState([]);
    const { user } = useUser();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/add-group");
    }

    useEffect(() => {
        if (!user?.uid) return;

        const fetchGroups = async () => {
            try {
                const response = await fetch(API_URL + `/groups/user/${user.uid}`);
                if (!response.ok) throw new Error("Could not load groups");
                const data = await response.json();
                setGroups(data);
            }
            catch (err){
                throw new Error(err);
            }
        };

        fetchGroups();
    }, [user?.uid]);

    return (
        <div className="h-screen w-screen flex flex-col">
            <HeaderBar username={user.username} profilePicture={user.profilePicture} />
            <PageBelowHeaderBar className="flex-1 overflow-y-auto">
                <div className="flex flex-col w-full gap-3 p-3">
                    {groups.map((group, index) => (
                        <DisplaySingleGroupInUserHome
                            key={index}
                            group_information={group}
                        />
                    ))}
                </div>
                <button
                    style={{ backgroundColor: "green" }}
                    className="fixed bottom-5 right-5 text-white h-25 w-25 rounded-full shadow-lg flex items-center justify-center"
                    onClick={handleClick}
                >
                    <span className="text-[3.5rem]">+</span>
                </button>
            </PageBelowHeaderBar>
        </div>
    )
}

export default Home;