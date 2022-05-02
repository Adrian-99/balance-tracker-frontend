import jwtDecode from "jwt-decode";
import { createContext } from "react";
import Tokens from "../data/tokens";
import { useLocalStorage } from "../hooks/local-storage";

export interface AuthenticatedUserContext {
    getAccessToken: () => string | undefined;
    getRefreshToken: () => string | undefined;
    getUsername: () => string | undefined;
    getEmail: () => string | undefined;
    getIsEmailVerified: () => boolean | undefined;
    getFirstName: () => string | undefined;
    getLastName: () => string | undefined;
    saveUserInfo: (tokens: Tokens) => void;
    isUserLoggedIn: () => boolean;
    clearUserInfo: () => void;
}

export const AuthenticationContext = createContext<AuthenticatedUserContext>({
    getAccessToken: () => undefined,
    getRefreshToken: () => undefined,
    getUsername: () => undefined,
    getEmail: () => undefined,
    getIsEmailVerified: () => undefined,
    getFirstName: () => undefined,
    getLastName: () => undefined,
    saveUserInfo: (_t) => {},
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
    const [getAccessToken, setAccessToken] = useLocalStorage<string>("accessToken");
    const [getRefreshToken, setRefreshToken] = useLocalStorage<string >("refreshToken");
    const [getUsername, setUsername] = useLocalStorage<string>("username");
    const [getEmail, setEmail] = useLocalStorage<string>("email");
    const [getIsEmailVerified, setIsEmailVerified] = useLocalStorage<boolean>("isEmailVerified");
    const [getFirstName, setFirstName] = useLocalStorage<string>("firstName");
    const [getLastName, setLastName] = useLocalStorage<string>("lastName");

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
        return getAccessToken() !== undefined;
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

    const authenticationContextValue: AuthenticatedUserContext = {
        getAccessToken,
        getRefreshToken,
        getUsername,
        getEmail,
        getIsEmailVerified,
        getFirstName,
        getLastName,
        saveUserInfo,
        isUserLoggedIn,
        clearUserInfo
    };

    return (
        <AuthenticationContext.Provider value={authenticationContextValue}>
            { children }
        </AuthenticationContext.Provider>
    );
}

export default AuthenticationProvider;
