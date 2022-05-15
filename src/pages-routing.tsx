import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ApplicationContext } from "./components/application-context.provider";
import ChangePasswordPage from "./pages/change-password.page";
import HomePage from "./pages/home.page";
import LoginPage from "./pages/login.page";
import RegisterPage from "./pages/register.page";
import ResetPasswordRequestPage from "./pages/reset-password/reset-password-request.page";
import ResetPasswordPage from "./pages/reset-password/reset-password.page";
import UserProfilePage from "./pages/user-profile.page";

const PagesRouting: React.FC = () => {
    const defaultElementIfLoggedIn = <Navigate to="/history" replace />;
    const defaultEmeentIfNotLoggedIn = <Navigate to="/login" replace />;
    
    const { user: { isUserLoggedIn } } = useContext(ApplicationContext);

    return (
        <Routes>
            <Route path="/" element={isUserLoggedIn ?
                defaultElementIfLoggedIn :
                <HomePage />
            } />
            <Route path="/register" element={isUserLoggedIn ?
                defaultElementIfLoggedIn :
                <RegisterPage />
            } />
            <Route path="/login" element={isUserLoggedIn ?
                defaultElementIfLoggedIn :
                <LoginPage />
            } />
            <Route path="/reset-password-request" element={isUserLoggedIn ?
                defaultElementIfLoggedIn :
                <ResetPasswordRequestPage />
            } />
            <Route path="/reset-password" element={isUserLoggedIn ?
                defaultElementIfLoggedIn :
                <ResetPasswordPage />
            } />

            <Route path="/change-password" element={isUserLoggedIn ?
                <ChangePasswordPage /> :
                defaultEmeentIfNotLoggedIn
            } />
            <Route path="/user-profile">
                <Route path="" element={isUserLoggedIn ?
                    <UserProfilePage /> :
                    defaultEmeentIfNotLoggedIn
                } />
                <Route path=":action" element={isUserLoggedIn ?
                    <UserProfilePage /> :
                    defaultEmeentIfNotLoggedIn
                } />
            </Route>
            <Route path="/history" element={isUserLoggedIn ?
                <></> :
                defaultEmeentIfNotLoggedIn
            } />
            <Route path="*" element={
                <Navigate to="/" replace />
            } />
        </Routes>
    );
}

export default PagesRouting;