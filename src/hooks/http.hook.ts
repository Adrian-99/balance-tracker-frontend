import properties from '../properties.json';
import Axios, { AxiosRequestConfig } from "axios";
import { useAuthentication } from './authentication.hook';
import Tokens from '../data/tokens';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useHttp = () => {
    const CONFIG: AxiosRequestConfig<any> = {
        baseURL: properties.apiContext,
        headers: {
            "Content-Type": "application/json"
        }
    };
    const ALLOW_ANONYMOUS: string[] = [
        "/user/register", "/user/authenticate", "/user/refresh-token", "/user/password/reset/request", "/user/password/reset"
    ];
    const IGNORE_UNAUTHORIZED: string[] = ["/user/authenticate"];

    const navigate = useNavigate();
    const { saveUserInfo, clearUserInfo, accessToken, refreshToken } = useAuthentication();

    const [refreshTokenCall, setRefreshTokenCall] = useState<Promise<Tokens> | undefined>(undefined);

    const refreshTokenRequest = (): Promise<Tokens> => {
        if (refreshTokenCall) {
            return refreshTokenCall;
        }

        var newCall = Axios.post<Tokens>("/user/refresh-token", { refreshToken }, CONFIG)
            .then(response => {
                setRefreshTokenCall(undefined);
                return response.data;
            })
            .catch(error => {
                setRefreshTokenCall(undefined);
                return Promise.reject(error);
            });

        setRefreshTokenCall(newCall);
        return newCall;
    }

    const axiosInstance = Axios.create(CONFIG);

    axiosInstance.interceptors.request.use(
        config => {
            if (config.url && !ALLOW_ANONYMOUS.includes(config.url)) {
                if (!config.headers) {
                    config.headers = {};
                }
                config.headers["Authorization"] = "Bearer " + accessToken;
            }
            return config;
        },
        error => Promise.reject(error)
    );
    axiosInstance.interceptors.response.use(
        response => response,
        error => {
            if (error.response?.status === 401 && !IGNORE_UNAUTHORIZED.includes(error.config.url)) {
                return refreshTokenRequest()
                    .then(response => {
                        saveUserInfo(response);
                        error.config.headers["Authorization"] = "Bearer " + response.accessToken;
                        return Axios.request(error.config);
                    })
                    .catch(innerError => {
                        if (innerError.response?.status === 400) {
                            clearUserInfo();
                            navigate("/login");
                        }
                        return Promise.reject(error);
                    });
            }
            return Promise.reject(error);
        }
    );

    return { http: axiosInstance };
}