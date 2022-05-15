import properties from '../properties.json';
import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import jwtDecode from "jwt-decode";
import { createContext, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import ActionResult from "../data/action-result";
import Tokens from "../data/tokens";

const LOCAL_STORAGE_KEYS = {
    accessToken: "accessToken",
    refreshToken: "refreshToken",
    username: "username",
    email: "email",
    isEmailVerified: "isEmailVerified",
    firstName: "firstName",
    lastName: "lastName"
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
    "/user/register", "/user/authenticate", "/user/refresh-token", "/user/password/reset/request", "/user/password/reset"
]

const HTTP_IGNORE_UNAUTHORIZED: string[] = ["/user/authenticate"]

let refreshTokenCall: Promise<Tokens> | undefined = undefined;

const getValueFromLocalStorage = (key: string): any => {
    return JSON.parse(localStorage.getItem(key) || "null");
}

export interface AppContext {
    user: {
        accessToken: string | null;
        refreshToken: string | null;
        username: string | null;
        email: string | null;
        isEmailVerified: boolean | null;
        firstName: string | null;
        lastName: string | null;
        isUserLoggedIn: boolean;
        saveUserInfo: (tokens: Tokens) => string;
        clearUserInfo: () => void;
    },
    http: AxiosInstance;
}

export const ApplicationContext = createContext<AppContext>({
    user: {
        accessToken: getValueFromLocalStorage(LOCAL_STORAGE_KEYS.accessToken),
        refreshToken: getValueFromLocalStorage(LOCAL_STORAGE_KEYS.refreshToken),
        username: getValueFromLocalStorage(LOCAL_STORAGE_KEYS.username),
        email: getValueFromLocalStorage(LOCAL_STORAGE_KEYS.email),
        isEmailVerified: getValueFromLocalStorage(LOCAL_STORAGE_KEYS.isEmailVerified),
        firstName: getValueFromLocalStorage(LOCAL_STORAGE_KEYS.firstName),
        lastName: getValueFromLocalStorage(LOCAL_STORAGE_KEYS.lastName),
        isUserLoggedIn: false,
        saveUserInfo: (_t) => "",
        clearUserInfo: () => {}
    },
    http: Axios.create(HTTP_CONFIG)
});

const ApplicationContextProvider: React.FC = ({ children }) => {
    const [accessToken, setAccessToken] = useLocalStorage<string | null>(LOCAL_STORAGE_KEYS.accessToken, null);
    const [refreshToken, setRefreshToken] = useLocalStorage<string | null>(LOCAL_STORAGE_KEYS.refreshToken, null);
    const [username, setUsername] = useLocalStorage<string | null>(LOCAL_STORAGE_KEYS.username, null);
    const [email, setEmail] = useLocalStorage<string | null>(LOCAL_STORAGE_KEYS.email, null);
    const [isEmailVerified, setIsEmailVerified] = useLocalStorage<boolean | null>(LOCAL_STORAGE_KEYS.isEmailVerified, null);
    const [firstName, setFirstName] = useLocalStorage<string | null>(LOCAL_STORAGE_KEYS.firstName, null);
    const [lastName, setLastName] = useLocalStorage<string | null>(LOCAL_STORAGE_KEYS.lastName, null);

    const saveUserInfo = (tokens: Tokens): string => {
        var decodedToken = jwtDecode<any>(tokens.accessToken);

        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        setUsername(decodedToken[ACCESS_TOKEN_KEYS.nameIdentifier]);
        setEmail(decodedToken[ACCESS_TOKEN_KEYS.email]);
        setIsEmailVerified(decodedToken[ACCESS_TOKEN_KEYS.authorizarionDecision]);
        setFirstName(decodedToken[ACCESS_TOKEN_KEYS.givenName] || null);
        setLastName(decodedToken[ACCESS_TOKEN_KEYS.surname] || null);

        return decodedToken[ACCESS_TOKEN_KEYS.nameIdentifier];
    };
    
    const clearUserInfo = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUsername(null);
        setEmail(null);
        setIsEmailVerified(null);
        setFirstName(null);
        setLastName(null);
        // window.localStorage.clear();
    };


    const refreshTokenRequest = (): Promise<Tokens> => {
        if (refreshTokenCall) {
            return refreshTokenCall;
        }

        var newCall = Axios.post<Tokens>("/user/refresh-token", { refreshToken }, HTTP_CONFIG)
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
        const axiosInstance = Axios.create(HTTP_CONFIG);
    
        axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
        axiosInstance.interceptors.request.use(
            config => {
                if (config.headers && config.url && HTTP_ALLOW_ANONYMOUS.includes(config.url)) {
                    config.headers["Authorization"] = "";
                }
                return config;
            },
            error => Promise.reject(error)
        );
        axiosInstance.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401 && !HTTP_IGNORE_UNAUTHORIZED.includes(error.config.url)) {
                    return refreshTokenRequest()
                        .then(response => {
                            saveUserInfo(response);
                            axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + response.accessToken;
                            error.config.headers["Authorization"] = "Bearer " + response.accessToken;
                            return Axios.request(error.config);
                        })
                        .catch(innerError => {
                            if (innerError.response?.status === 400) {
                                clearUserInfo();
                                axiosInstance.defaults.headers.common["Authorization"] = "";
                            }
                            return Promise.reject(error);
                        });
                }
                return Promise.reject(error);
            }
        );

        return axiosInstance;
    };

    const contextValue: AppContext = {
        user: {
            accessToken,
            refreshToken,
            username,
            email,
            isEmailVerified,
            firstName,
            lastName,
            isUserLoggedIn: accessToken !== null,
            saveUserInfo,
            clearUserInfo
        },
        http: newAxiosInstance()
    };

    useEffect(() => {
        if (accessToken) {
            contextValue.http.get<ActionResult>("/user/validate-token");
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <ApplicationContext.Provider value={contextValue}>
            { children }
        </ApplicationContext.Provider>
    );
}

export default ApplicationContextProvider;
