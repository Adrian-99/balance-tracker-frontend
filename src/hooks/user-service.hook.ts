import ActionResult from "../data/action-result";
import Authenticate from "../data/authenticate";
import ChangePassword from "../data/change-password";
import ChangeUserData from "../data/change-user-data";
import ResetPassword from "../data/reset-password";
import ResetPasswordRequest from "../data/reset-password-request";
import Tokens from "../data/tokens";
import UserData from "../data/user-data";
import UserRegister from "../data/user-register";
import { useHttp } from "./http.hook";

export const useUserService = () => {
    const { http } = useHttp();

    const registerUser = (data: UserRegister): Promise<ActionResult> => {
        return http.post<ActionResult>("/user/register", data)
            .then(response => response.data);
    }

    const authenticateUser = (data: Authenticate): Promise<Tokens> => {
        return http.post<Tokens>("/user/authenticate", data)
            .then(response => response.data);
    }

    const revokeUserTokens = (): Promise<undefined> => {
        return http.delete<undefined>("/user/revoke-tokens")
            .then(response => response.data);
    }

    const resetUserPasswordRequest = (data: ResetPasswordRequest): Promise<ActionResult> => {
        return http.post<ActionResult>("/user/password/reset/request", data)
            .then(response => response.data);
    }

    const resetPassword = (data: ResetPassword): Promise<ActionResult> => {
        return http.patch<ActionResult>("/user/password/reset", data)
            .then(response => response.data);
    }

    const changePassword = (data: ChangePassword): Promise<ActionResult> => {
        return http.patch<ActionResult>("/user/password/change", data)
            .then(response => response.data);
    }

    const getUserData = (): Promise<UserData> => {
        return http.get<UserData>("/user/data")
            .then(response => response.data);
    }

    const changeUserData = (data: ChangeUserData): Promise<Tokens> => {
        return http.patch<Tokens>("/user/data", data)
            .then(response => response.data);
    }

    return { registerUser,
        authenticateUser,
        revokeUserTokens,
        resetUserPasswordRequest,
        resetPassword,
        changePassword,
        getUserData,
        changeUserData
    };
}