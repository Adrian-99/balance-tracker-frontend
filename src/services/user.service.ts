import ActionResult from "../data/action-result";
import UserRegister from "../data/user-register";
import http from "../http-common";

export default abstract class UserService {
    public static register(data: UserRegister): Promise<ActionResult> {
        return http.post<ActionResult>("/user/register", data)
            .then(response => response.data);
    }
}