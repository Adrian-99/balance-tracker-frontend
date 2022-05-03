import jwtDecode from "jwt-decode";
import { createContext } from "react";
import { useLocalStorage } from "usehooks-ts";
import Tokens from "../data/tokens";

export interface AuthenticatedUserContext {
    accessToken: string | undefined;
    refreshToken: string | undefined;
    username: string | undefined;
    email: string | undefined;
    isEmailVerified: boolean | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    saveUserInfo: (tokens: Tokens) => string;
    isUserLoggedIn: () => boolean;
    clearUserInfo: () => void;
}

export const AuthenticationContext = createContext<AuthenticatedUserContext>({
    accessToken: undefined,
    refreshToken: undefined,
    username: undefined,
    email: undefined,
    isEmailVerified: undefined,
    firstName: undefined,
    lastName: undefined,
    saveUserInfo: (_t) => "",
    isUserLoggedIn: () => false,
    clearUserInfo: () => {}
});

interface DecodedAccessToken {
    username: string;
    email: string;
    isEmailVerified: boolean;
    firstName?: string | undefined;
    lastName?: string | undefined;
}

const AuthenticationProvider: React.FC = ({ children }) => {
    const [accessToken, setAccessToken] = useLocalStorage<string | undefined>("accessToken", undefined);
    const [refreshToken, setRefreshToken] = useLocalStorage<string | undefined>("refreshToken", undefined);
    const [username, setUsername] = useLocalStorage<string | undefined>("username", undefined);
    const [email, setEmail] = useLocalStorage<string | undefined>("email", undefined);
    const [isEmailVerified, setIsEmailVerified] = useLocalStorage<boolean | undefined>("isEmailVerified", undefined);
    const [firstName, setFirstName] = useLocalStorage<string | undefined>("firstName", undefined);
    const [lastName, setLastName] = useLocalStorage<string | undefined>("lastName", undefined);

    const saveUserInfo = (tokens: Tokens): string => {
        var decodedToken = decodeAccessToken(tokens.accessToken);

        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        setUsername(decodedToken.username);
        setEmail(decodedToken.email);
        setIsEmailVerified(decodedToken.isEmailVerified);
        setFirstName(decodedToken.firstName || undefined);
        setLastName(decodedToken.lastName || undefined);

        return decodedToken.username;
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

    const isUserLoggedIn = (): boolean => {
        return accessToken !== undefined;
    }
    
    const clearUserInfo = () => {
        setAccessToken(undefined);
        setRefreshToken(undefined);
        setUsername(undefined);
        setEmail(undefined);
        setIsEmailVerified(undefined);
        setFirstName(undefined);
        setLastName(undefined);
        // window.localStorage.clear();
    }

    const contextValue: AuthenticatedUserContext = {
        accessToken,
        refreshToken,
        username,
        email,
        isEmailVerified,
        firstName,
        lastName,
        saveUserInfo,
        isUserLoggedIn,
        clearUserInfo
    };

    return (
        <AuthenticationContext.Provider value={contextValue}>
            { children }
        </AuthenticationContext.Provider>
    );
}

export default AuthenticationProvider;
