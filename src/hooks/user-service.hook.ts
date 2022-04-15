import ActionResult from "../data/action-result";
import Authenticate from "../data/authenticate";
import Tokens from "../data/tokens";
import UserRegister from "../data/user-register";
import http from "../http-common";
import { useAuthentication } from "./authentication.hook";

export const useUserService = () => {
    const { accessToken } = useAuthentication();

    const registerUser = (data: UserRegister): Promise<ActionResult> => {
        return http.post<ActionResult>("/user/register", data)
            .then(response => response.data);
    }

    const authenticateUser = (data: Authenticate): Promise<Tokens> => {
        return http.post<Tokens>("/user/authenticate", data)
            .then(response => response.data);
    }

    const revokeUserTokens = (): Promise<any> => {
        return http.delete<any>("/user/revoke-tokens", { headers: { Authorization: "Bearer " + accessToken } })
            .then(response => response.data);
    }

    return { registerUser, authenticateUser, revokeUserTokens };
}