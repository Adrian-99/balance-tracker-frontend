import { useLocalStorage } from "usehooks-ts";
import Tokens from "../data/tokens"

export const useAuthentication = () => {
    const [accessToken, setAccessToken] = useLocalStorage<string | undefined>("accessToken", undefined);
    const [refreshToken, setRefreshToken] = useLocalStorage<string | undefined>("refreshToken", undefined);

    const saveTokens: (tokens: Tokens) => void = tokens => {
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
    }

    const isUserLoggedIn: () => boolean = () => {
        return accessToken !== undefined;
    }

    return { saveTokens, isUserLoggedIn };
}