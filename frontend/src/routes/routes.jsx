import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Ranking from "../pages/Ranking";
import Voting from "../pages/Voting";
import AddGroup from "../pages/AddGroup";
import CreateGroup from "../pages/CreateGroup";
import Challenge from "../pages/Challenge";
import GroupTabs from "../components/GroupTabs.jsx";

const routes = [
    { path: "/home", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/group", element: <GroupTabs /> },
    { path: "/voting", element: <Voting /> },
    { path: "/add-group", element: <AddGroup /> },
    { path: "/create-group", element: <CreateGroup /> },
    { path: "/challenge", element: <Challenge /> },
];

export default routes;
