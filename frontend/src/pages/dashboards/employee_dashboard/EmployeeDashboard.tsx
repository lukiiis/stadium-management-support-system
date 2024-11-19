import { Link, Outlet } from "react-router-dom";

const EmployeeDashboard = () => {
    return (
        <div>
            <h1>employee dashboard</h1>
            <Link to="add-tournament">add tournaments </Link>
            <Link to="add-timesheet">add timesheet</Link>
            <Outlet/>
        </div>
    )
}

export default EmployeeDashboard;