import Tokens from "../data/tokens"
import jwtDecode from "jwt-decode";
import { useLocalStorage } from "./local-storage";

interface DecodedAccessToken {
    username: string;
    email: string;
    isEmailVerified: boolean;
    firstName?: string | undefined;
    lastName?: string | undefined;
}

export const useAuthentication = () => {
    const KEYS = {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
        username: "username",
        email: "email",
        isEmailVerified: "isEmailVerified",
        firstName: "firstName",
        lastName: "lastName"
    }

    const [getAccessToken, setAccessToken] = useLocalStorage<string>(KEYS.accessToken);
    const [getRefreshToken, setRefreshToken] = useLocalStorage<string>(KEYS.refreshToken);
    const [getUsername, setUsername] = useLocalStorage<string>(KEYS.username);
    const [getEmail, setEmail] = useLocalStorage<string>(KEYS.email);
    const [getIsEmailVerified, setIsEmailVerified] = useLocalStorage<boolean>(KEYS.isEmailVerified);
    const [getFirstName, setFirstName] = useLocalStorage<string>(KEYS.firstName);
    const [getLastName, setLastName] = useLocalStorage<string>(KEYS.lastName);

    const isUserLoggedIn = (): boolean => {
        return getAccessToken() !== undefined;
    };

    const saveUserInfo = (tokens: Tokens) => {
        var decodedToken = decodeAccessToken(tokens.accessToken);

        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        setUsername(decodedToken.username);
        setEmail(decodedToken.email);
        setIsEmailVerified(decodedToken.isEmailVerified);
        setFirstName(decodedToken.firstName);
        setLastName(decodedToken.lastName);
    }

    const decodeAccessToken = (accessToken: string): DecodedAccessToken => {
        const NAME_IDENTIFIER = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
        const EMAIL = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
        const AUTHORIZATION_DECISION = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision";
        const GIVEN_NAME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";
        const SURNAME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";

        var decodedToken = jwtDecode<any>(accessToken);

        return {
            username: decodedToken[NAME_IDENTIFIER],
            email: decodedToken[EMAIL],
            isEmailVerified: decodedToken[AUTHORIZATION_DECISION],
            firstName: decodedToken[GIVEN_NAME],
            lastName: decodedToken[SURNAME]
        };
    }
    
    const clearUserInfo = () => {
        setAccessToken(undefined);
        setRefreshToken(undefined);
        setUsername(undefined);
        setEmail(undefined);
        setIsEmailVerified(undefined);
        setFirstName(undefined);
        setLastName(undefined);
    }

    return { getAccessToken,
        getRefreshToken,
        getUsername,
        getEmail,
        getIsEmailVerified,
        getFirstName,
        getLastName,
        isUserLoggedIn,
        saveUserInfo,
        clearUserInfo
    };
}
