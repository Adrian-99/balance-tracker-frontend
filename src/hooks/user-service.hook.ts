import { useContext } from "react";
import { ApplicationContext } from "../components/application-context.provider";
import ApiResponse from "../data/api-response";
import Authenticate from "../data/authenticate";
import ChangePassword from "../data/change-password";
import ChangeUserData from "../data/change-user-data";
import ResetPassword from "../data/reset-password";
import ResetPasswordRequest from "../data/reset-password-request";
import Tokens from "../data/tokens";
import UserData from "../data/user-data";
import UserRegister from "../data/user-register";
import VerifyEmail from "../data/verify-email";

export const useUserService = () => {
    const { http } = useContext(ApplicationContext);

    const registerUser = (data: UserRegister): Promise<ApiResponse<string>> => {
        return http.post<ApiResponse<string>>("/user/register", data)
            .then(response => response.data);
    };

    const verifyEmail = (data: VerifyEmail): Promise<ApiResponse<Tokens>> => {
        return http.patch<ApiResponse<Tokens>>("/user/verify-email", data)
            .then(response => response.data);
    };

    const resetEmailVerificationCode = (): Promise<ApiResponse<string>> => {
        return http.post<ApiResponse<string>>("/user/verify-email/reset-code")
            .then(response => response.data);
    };

    const authenticateUser = (data: Authenticate): Promise<ApiResponse<Tokens>> => {
        return http.post<ApiResponse<Tokens>>("/user/authenticate", data)
            .then(response => response.data);
    };

    const validateUserToken = (): Promise<ApiResponse<string>> => {
        return http.get<ApiResponse<string>>("/user/validate-token")
            .then(response => response.data);
    }

    const revokeUserTokens = (): Promise<ApiResponse<string>> => {
        return http.delete<ApiResponse<string>>("/user/revoke-tokens")
            .then(response => response.data);
    };

    const resetUserPasswordRequest = (data: ResetPasswordRequest): Promise<ApiResponse<string>> => {
        return http.post<ApiResponse<string>>("/user/password/reset/request", data)
            .then(response => response.data);
    };

    const resetPassword = (data: ResetPassword): Promise<ApiResponse<string>> => {
        return http.patch<ApiResponse<string>>("/user/password/reset", data)
            .then(response => response.data);
    };

    const changePassword = (data: ChangePassword): Promise<ApiResponse<string>> => {
        return http.patch<ApiResponse<string>>("/user/password/change", data)
            .then(response => response.data);
    };

    const getUserData = (): Promise<ApiResponse<UserData>> => {
        return http.get<ApiResponse<UserData>>("/user/data")
            .then(response => {
                response.data.data.lastUsernameChangeAt = new Date(response.data.data.lastUsernameChangeAt);
                return response.data;
            });
    };

    const changeUserData = (data: ChangeUserData): Promise<ApiResponse<Tokens>> => {
        return http.patch<ApiResponse<Tokens>>("/user/data", data)
            .then(response => response.data);
    };

    return { registerUser,
        verifyEmail,
        resetEmailVerificationCode,
        authenticateUser,
        validateUserToken,
        revokeUserTokens,
        resetUserPasswordRequest,
        resetPassword,
        changePassword,
        getUserData,
        changeUserData
    };
}