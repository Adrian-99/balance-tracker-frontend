import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthentication } from "./hooks/authentication.hook";
import LoginPage from "./pages/login.page";
import RegisterPage from "./pages/register.page";
import ResetPasswordRequestPage from "./pages/reset-password/reset-password-request.page";
import ResetPasswordPage from "./pages/reset-password/reset-password.page";

const PagesRouting: React.FC = () => {
    const { isUserLoggedIn } = useAuthentication();

    return (
        <Routes>
            <Route path="/" element={isUserLoggedIn() ?
                <Navigate to="/history" replace /> :
                <></>
            } />
            <Route path="/register" element={isUserLoggedIn() ?
                <Navigate to="/" replace /> :
                <RegisterPage />
            } />
            <Route path="/login" element={isUserLoggedIn() ?
                <Navigate to="/" replace /> :
                <LoginPage />
            } />
            <Route path="/reset-password-request" element={isUserLoggedIn() ?
                <Navigate to="/" replace /> :
                <ResetPasswordRequestPage />
            } />
            <Route path="/reset-password" element={isUserLoggedIn() ?
                <Navigate to="/" replace /> :
                <ResetPasswordPage />
            } />
            <Route path="/history" element={isUserLoggedIn() ?
                <></> :
                <Navigate to="/login" replace />
            } />
            <Route path="*" element={
                <Navigate to="/" replace />
            } />
        </Routes>
    );
}

export default PagesRouting;