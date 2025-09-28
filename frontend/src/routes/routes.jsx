import {LoginForm} from "../pages/login-form";
import {SignUpForm} from "../pages/SignUp-form";
import Voting from "../pages/Voting";
import AddGroup from "../pages/AddGroup";
import CreateGroup from "../pages/CreateGroup";
import Challenge from "../pages/Challenge";
import GroupTabs from "../components/GroupTabs.jsx";
import Home from "../pages/Home.jsx";

const routes = [
    { path: "/home", element: <Home /> },
    { path: "/login", element: <LoginForm /> },
    { path: "/signup", element: <SignUpForm /> },
    { path: `group/:groupId`, element: <GroupTabs /> },
    { path: "/voting", element: <Voting /> },
    { path: "/add-group", element: <AddGroup /> },
    { path: "/create-group", element: <CreateGroup /> },
    { path: "/challenge", element: <Challenge /> },
];

export default routes;
