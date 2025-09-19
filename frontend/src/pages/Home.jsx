import HeaderBar from "../components/HeaderBar.jsx";
import {useEffect, useState} from "react";
import PageBelowHeaderBar from "../components/PageBelowHeaderBar.jsx";
import {useNavigate} from "react-router-dom";
import DisplaySingleGroupInUserHome from "../components/DisplaySingleGroupInUserHome.jsx";
import {API_URL} from "../config/config.js";

function Home() {
    const [username, setUsername] = useState("No username set");
    const [groups, setGroups] = useState([
        {
            name: "GroupName A",
            challenge: "Meme Recreation",
            description: "Recreate a popular meme with yourself."
        },
        {
            name: "GroupName B",
            challenge: "Emoji Challenge",
            description: "Recreate an emoji with facial expression or pose."
        },
        {
            name: "GroupName C",
            challenge: "Food Art",
            description: "Create a funny or beautiful picture with food."
        },
        {
            name: "GroupName D",
            challenge: "Outfit Chaos",
            description: "Wear the craziest combination of clothes you can find."
        },
        {
            name: "GroupName E",
            challenge: "Theme Photo",
            description: "Take a photo based on a color theme, e.g., everything in red."
        },
        {
            name: "GroupName F",
            challenge: "Lookalike",
            description: "Find something that looks like you."
        },
        {
            name: "GroupName G",
            challenge: "Mini vs. Maxi",
            description: "Photograph something tiny compared to something huge."
        }
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/create-group");
    }

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch(API_URL + "/groups");
                if (!response.ok) throw new Error("Could not load groups");
                const data = await response.json();
                setGroups(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);



    return (
        <div className="h-screen w-screen flex flex-col">
            <HeaderBar username={username}>
                <h1 className="mt-0 mb-0">Hello world</h1>
            </HeaderBar>
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
                    style={{ backgroundColor: "#2bff00" }}
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