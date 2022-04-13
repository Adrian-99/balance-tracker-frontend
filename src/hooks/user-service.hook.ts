import ActionResult from "../data/action-result";
import Authenticate from "../data/authenticate";
import Tokens from "../data/tokens";
import UserRegister from "../data/user-register";
import http from "../http-common";

export const useUserService = () => {
    const registerUser: (data: UserRegister) => Promise<ActionResult> = data => {
        return http.post<ActionResult>("/user/register", data)
            .then(response => response.data);
    }

    const authenticateUser: (data: Authenticate) => Promise<Tokens> = data => {
        return http.post<Tokens>("/user/authenticate", data)
            .then(response => response.data);
    }

    return { registerUser, authenticateUser };
}