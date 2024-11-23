import { Link, Outlet } from "react-router-dom";

const AdminDashboard = () => {
    return (
        <div>
            <h1>admin profileeeeee</h1>
            <Link to="create-employee">create-employee</Link>
            <Link to="block-account">block-account</Link>
            <Outlet />
        </div>
    )
}

export default AdminDashboard;