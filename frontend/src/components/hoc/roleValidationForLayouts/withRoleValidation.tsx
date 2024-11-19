import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const withRoleValidation = (Component: React.FC, requiredRole: string) => {
    const WrappedComponent = (props: any) => {
        const navigate = useNavigate();

        useEffect(() => {
            const role = localStorage.getItem("role");
            const token = localStorage.getItem("token");
            const storedUserId = localStorage.getItem("userId");

            if (role !== requiredRole || !token || !storedUserId) {
                navigate("/");
            }
        }, []);

        return <Component {...props} />;
    };

    return WrappedComponent;
};

export default withRoleValidation;
