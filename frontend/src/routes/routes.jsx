import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Ranking from "../pages/Ranking";
import Voting from "../pages/Voting";
import AddGroup from "../pages/AddGroup";
import CreateGroup from "../pages/CreateGroup";
import Challenge from "../pages/Challenge";
import GroupTabs from "../components/GroupTabs.jsx";
import HomeWrapper from "../pages/HomeWrapper.jsx";

const routes = [
    { path: "/home", element: <HomeWrapper /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
    { path: `group/:groupId`, element: <GroupTabs /> },
    { path: "/voting", element: <Voting /> },
    { path: "/add-group", element: <AddGroup /> },
    { path: "/create-group", element: <CreateGroup /> },
    { path: "/challenge", element: <Challenge /> },
];

export default routes;
