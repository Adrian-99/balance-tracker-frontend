import properties from '../properties.json';
import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import jwtDecode from "jwt-decode";
import { createContext, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import ApiResponse from "../data/api-response";
import Tokens from "../data/tokens";
import ValidationRules from '../data/validation-rules';

const LOCAL_STORAGE_KEYS = {
    authenticatedUser: "authenticatedUser",
    valiationRules: "validationRules"
}

const ACCESS_TOKEN_KEYS = {
    nameIdentifier: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
    email: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
    authorizarionDecision: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision",
    givenName: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
    surname: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"
}

const HTTP_CONFIG: AxiosRequestConfig<any> = {
    baseURL: properties.apiContext,
    headers: {
        "Content-Type": "application/json"
    }
}

const HTTP_ALLOW_ANONYMOUS: string[] = [
    "/user/register",
    "/user/authenticate",
    "/user/refresh-token",
    "/user/password/reset/request",
    "/user/password/reset",
    "/validation-rule/all"
]

const HTTP_IGNORE_UNAUTHORIZED: string[] = ["/user/authenticate"]

let refreshTokenCall: Promise<ApiResponse<Tokens>> | undefined = undefined;

const getValueFromLocalStorage = (key: string): any => {
    return JSON.parse(localStorage.getItem(key) || "null");
}

interface AuthenticatedUser {
    accessToken: string;
    refreshToken: string;
    username: string;
    email: string;
    isEmailVerified: boolean;
    firstName: string | undefined;
    lastName: string | undefined;
}

export interface AppContext {
    user: AuthenticatedUser | null,
    saveUserInfo: (tokens: Tokens) => string;
    clearUserInfo: () => void;
    validationRules: ValidationRules;
    http: AxiosInstance;
}

export const ApplicationContext = createContext<AppContext>({
    user: getValueFromLocalStorage(LOCAL_STORAGE_KEYS.authenticatedUser),
    saveUserInfo: (_t) => "",
    clearUserInfo: () => {},
    validationRules: getValueFromLocalStorage(LOCAL_STORAGE_KEYS.valiationRules),
    http: Axios.create(HTTP_CONFIG)
});

const ApplicationContextProvider: React.FC = ({ children }) => {
    const [authenticatedUser, setAuthenticatedUser] = useLocalStorage<AuthenticatedUser | null>(LOCAL_STORAGE_KEYS.authenticatedUser, null);
    const [validationRules, setValidationRules] = useLocalStorage<ValidationRules>(LOCAL_STORAGE_KEYS.valiationRules, {
        userUsernameMaxLength: 40,
        userUsernameAllowedChangeFrequencyDays: 7,
        userFirstNameMaxLength: 40,
        userLastNameMaxLength: 40,
        userPasswordMinLength: 8,
        userPasswordMaxLength: 40,
        userPasswordSmallLetterRequired: true,
        userPasswordBigLetterRequired: true,
        userPasswordDigitRequired: true,
        userPasswordSpecialCharacterRequired: true,
        userPasswordForbidSameAsUsername: true,
        userPasswordForbidSameAsCurrent: true,
        entryNameMaxLength: 100,
        entryDescriptionMaxLength: 1000,
        tagNameMaxLength: 50
    });

    const refreshTokenRequest = (): Promise<ApiResponse<Tokens>> => {
        if (refreshTokenCall) {
            return refreshTokenCall;
        }

        var newCall = Axios.post<ApiResponse<Tokens>>("/user/refresh-token", { refreshToken: authenticatedUser?.refreshToken }, HTTP_CONFIG)
            .then(response => {
                refreshTokenCall = undefined;
                return response.data;
            })
            .catch(error => {
                refreshTokenCall = undefined;
                return Promise.reject(error);
            });
        
        refreshTokenCall = newCall;
        return newCall;
    }

    const newAxiosInstance = () => {
        const newAxiosInstance = Axios.create(HTTP_CONFIG);
    
        newAxiosInstance.defaults.headers.common["Authorization"] = "Bearer " + authenticatedUser?.accessToken;
        newAxiosInstance.interceptors.request.use(
            config => {
                if (config.headers && config.url && HTTP_ALLOW_ANONYMOUS.includes(config.url)) {
                    config.headers["Authorization"] = "";
                }
                return config;
            },
            error => Promise.reject(error)
        );
        newAxiosInstance.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401 && !HTTP_IGNORE_UNAUTHORIZED.includes(error.config.url)) {
                    return refreshTokenRequest()
                        .then(response => {
                            saveUserInfo(response.data);
                            newAxiosInstance.defaults.headers.common["Authorization"] = "Bearer " + response.data.accessToken;
                            error.config.headers["Authorization"] = "Bearer " + response.data.accessToken;
                            return Axios.request(error.config);
                        })
                        .catch(innerError => {
                            if (innerError.response?.status === 400) {
                                clearUserInfo();
                                newAxiosInstance.defaults.headers.common["Authorization"] = "";
                            }
                            return Promise.reject(error);
                        });
                }
                return Promise.reject(error);
            }
        );

        return newAxiosInstance;
    };

    const saveUserInfo = (tokens: Tokens): string => {
        var decodedToken = jwtDecode<any>(tokens.accessToken);

        setAuthenticatedUser({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            username: decodedToken[ACCESS_TOKEN_KEYS.nameIdentifier],
            email: decodedToken[ACCESS_TOKEN_KEYS.email],
            isEmailVerified: JSON.parse(decodedToken[ACCESS_TOKEN_KEYS.authorizarionDecision]),
            firstName: decodedToken[ACCESS_TOKEN_KEYS.givenName] || undefined,
            lastName: decodedToken[ACCESS_TOKEN_KEYS.surname] || undefined
        });

        return decodedToken[ACCESS_TOKEN_KEYS.nameIdentifier];
    };
    
    const clearUserInfo = () => {
        setAuthenticatedUser(null);
    };

    const contextValue: AppContext = {
        user: authenticatedUser,
        saveUserInfo,
        clearUserInfo,
        validationRules: validationRules,
        http: newAxiosInstance()
    };

    useEffect(() => {
        if (authenticatedUser?.accessToken) {
            contextValue.http.get<ApiResponse<string>>("/user/validate-token");
        }
        contextValue.http.get<ApiResponse<ValidationRules>>("/validation-rule/all")
            .then(response => setValidationRules(response.data.data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <ApplicationContext.Provider value={contextValue}>
            { children }
        </ApplicationContext.Provider>
    );
}

export default ApplicationContextProvider;
