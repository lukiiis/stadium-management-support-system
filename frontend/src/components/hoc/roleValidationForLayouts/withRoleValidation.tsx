import { Navigate } from 'react-router-dom';

const withRoleValidation = (Component: React.FC, requiredRole: string) => {
    const WrappedComponent = (props: any) => {

        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");

        if (role !== requiredRole || !token || !storedUserId) {
            return <Navigate to="/" replace />;
        }

        return <Component {...props} />;
    };
    return WrappedComponent;
};

export default withRoleValidation;
