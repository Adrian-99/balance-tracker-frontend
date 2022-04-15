import ActionResult from "../data/action-result";
import Authenticate from "../data/authenticate";
import Tokens from "../data/tokens";
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

    return { registerUser, authenticateUser, revokeUserTokens };
}