import { Navigate } from 'react-router-dom';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('token');

    if (token) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};