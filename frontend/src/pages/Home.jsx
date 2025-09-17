import HeaderBar from "../components/HeaderBar.jsx";
import {useState} from "react";

function Home(){
    const [username, setUsername] = useState("No username set");
    return(
        <HeaderBar username={username}>
            <h1>Hello world</h1>
        </HeaderBar>
    )
}

export default Home;