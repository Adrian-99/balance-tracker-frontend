export {}
// import Tokens from "../data/tokens"
// import jwtDecode from "jwt-decode";
// import { useContext } from "react";
// import { AuthenticationContext } from "../components/authentication.component";

// interface State<T> {
//     get: () => T;
//     set: (value: T) => void;
// }

// export interface AuthenticatedUserContext {
//     accessToken: State<string | null>;
//     refreshToken: State<string | null>;
//     username: State<string | null>;
//     email: State<string | null>;
//     isEmailVerified: State<boolean | null>;
//     firstName: State<string | null>;
//     lastName: State<string | null>;
// }

// interface DecodedAccessToken {
//     username: string;
//     email: string;
//     isEmailVerified: boolean;
//     firstName?: string | undefined;
//     lastName?: string | undefined;
// }

// export const useAuthentication = () => {
//     const authenticationContext = useContext(AuthenticationContext)

//     const saveUserInfo = (tokens: Tokens): string => {
//         var decodedToken = decodeAccessToken(tokens.accessToken);

//         authenticationContext.accessToken.set(tokens.accessToken);
//         authenticationContext.refreshToken.set(tokens.refreshToken);
//         authenticationContext.username.set(decodedToken.username);
//         authenticationContext.email.set(decodedToken.email);
//         authenticationContext.isEmailVerified.set(decodedToken.isEmailVerified);
//         authenticationContext.firstName.set(decodedToken.firstName || null);
//         authenticationContext.lastName.set(decodedToken.lastName || null);

//         return decodedToken.username;
//     }

//     const decodeAccessToken = (accessToken: string): DecodedAccessToken => {
//         const NAME_IDENTIFIER = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
//         const EMAIL = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
//         const AUTHORIZATION_DECISION = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision";
//         const GIVEN_NAME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";
//         const SURNAME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";

//         var decodedToken = jwtDecode<any>(accessToken);

//         return {
//             username: decodedToken[NAME_IDENTIFIER],
//             email: decodedToken[EMAIL],
//             isEmailVerified: decodedToken[AUTHORIZATION_DECISION],
//             firstName: decodedToken[GIVEN_NAME],
//             lastName: decodedToken[SURNAME]
//         };
//     }

//     const isUserLoggedIn = (): boolean => {
//         return authenticationContext.accessToken.get() !== null;
//     }
    
//     const clearUserInfo = () => {
//         authenticationContext.accessToken.set(null);
//         authenticationContext.refreshToken.set(null);
//         authenticationContext.username.set(null);
//         authenticationContext.email.set(null);
//         authenticationContext.isEmailVerified.set(null);
//         authenticationContext.firstName.set(null);
//         authenticationContext.lastName.set(null);
//         // window.localStorage.clear();
//     }

//     return { getAccessToken: authenticationContext.accessToken.get,
//         getRefreshToken: authenticationContext.refreshToken.get,
//         getUsername: authenticationContext.username.get,
//         getEmail: authenticationContext.email.get,
//         getIsEmailVerified: authenticationContext.isEmailVerified.get,
//         getFirstName: authenticationContext.firstName.get,
//         getLastName: authenticationContext.lastName.get,
//         saveUserInfo,
//         isUserLoggedIn,
//         clearUserInfo
//     };
// }