import { useContext } from "react";
import { Buffer } from "buffer";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ApplicationContext } from "./components/application-context.provider";
import ChangePasswordPage from "./pages/change-password.page";
import HomePage from "./pages/home.page";
import LoginPage from "./pages/login.page";
import RegisterPage from "./pages/register.page";
import ResetPasswordRequestPage from "./pages/reset-password/reset-password-request.page";
import ResetPasswordPage from "./pages/reset-password/reset-password.page";
import UserProfilePage from "./pages/user-profile.page";
import HistoryPage from "./pages/history.page";
import { TagsPage } from "./pages/tags.page";
import StatisticsPage from "./pages/statistics.page";

const PagesRouting: React.FC = () => {
    const location = useLocation();
    const locationBase64 = Buffer.from(location.pathname + location.search).toString("base64");
    
    const defaultElementIfLoggedIn = <Navigate to="/history" replace />;
    const defaultElementIfNotLoggedIn = <Navigate to={"/login?redirectTo=" + locationBase64} replace />;
    
    const { user } = useContext(ApplicationContext);

    return (
        <Routes>
            <Route path="/" element={user ?
                defaultElementIfLoggedIn :
                <HomePage />
            } />
            <Route path="/register" element={user ?
                defaultElementIfLoggedIn :
                <RegisterPage />
            } />
            <Route path="/login" element={user ?
                defaultElementIfLoggedIn :
                <LoginPage />
            } />
            <Route path="/reset-password-request" element={user ?
                defaultElementIfLoggedIn :
                <ResetPasswordRequestPage />
            } />
            <Route path="/reset-password" element={user ?
                defaultElementIfLoggedIn :
                <ResetPasswordPage />
            } />

            <Route path="/change-password" element={user ?
                <ChangePasswordPage /> :
                defaultElementIfNotLoggedIn
            } />
            <Route path="/user-profile">
                <Route path="" element={user ?
                    <UserProfilePage /> :
                    defaultElementIfNotLoggedIn
                } />
                <Route path=":action" element={user ?
                    <UserProfilePage /> :
                    defaultElementIfNotLoggedIn
                } />
            </Route>
            <Route path="/history" element={user ?
                <HistoryPage /> :
                defaultElementIfNotLoggedIn
            } />
            <Route path="/tags" element={user ?
                <TagsPage /> :
                defaultElementIfNotLoggedIn
            } />
            <Route path="/statistics" element={user ?
                <StatisticsPage /> :
                defaultElementIfNotLoggedIn
            } />
            <Route path="*" element={
                <Navigate to="/" replace />
            } />
        </Routes>
    );
}

export default PagesRouting;