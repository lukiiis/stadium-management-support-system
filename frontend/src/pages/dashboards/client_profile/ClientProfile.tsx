import { Link, Outlet } from "react-router-dom";

const ClientProfile = () => {
    return (
        <div>
            <div>client profileeeeee</div>
            <Link to="information">profile</Link>
            <Link to="tournaments">tournaments</Link>
            <Link to="reservations">reservations</Link>
            <Outlet />
        </div>
    )
}

export default ClientProfile;