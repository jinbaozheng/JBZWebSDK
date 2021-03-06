/**
 * Created by cuppi on 2017/9/4.
 */

import {AxiosRequestConfig, AxiosResponse} from "axios";
import UrlTool from "../tool/JToolUrl";

abstract class JNetworkDelegate{
    globalParas: Function;
    globalHeaders: Function;
    abstract requestInterceptor(config: AxiosRequestConfig): AxiosRequestConfig;
    abstract requestInterceptorError(error: Error): Promise<never>;
    abstract responseInterceptor(response: AxiosResponse): AxiosResponse;
    abstract responseInterceptorError(error: Error): Promise<never>;
    abstract resolveInterceptor(response: AxiosResponse, data: any): boolean;
    abstract rejectInterceptor(response: AxiosResponse, error: Error): boolean;
}

export default JNetworkDelegate;

// export const defaultInterceptor = {
export const DEFAULT_DELEGATE: JNetworkDelegate = {
    globalParas: () => {},
    globalHeaders: () => {},
    requestInterceptor: (config: AxiosRequestConfig): AxiosRequestConfig => {
        // Do something before request is sent
        console.log('POST ' + UrlTool.urlFromPortion(config.url, '', config.params));
        return config;
    },
    requestInterceptorError: (error: Error): Promise<never> => {
        // Do something with request error
        return Promise.reject(error);
    },
    responseInterceptor: (response: AxiosResponse): AxiosResponse => {
        // Do something with response data
        return response;
    },
    responseInterceptorError: (error: Error): Promise<never> => {
        // Do something with response error
        return Promise.reject(error);
    },
    resolveInterceptor: (response: AxiosResponse, data: any): boolean => {
        return true;
    },
    rejectInterceptor: (response: AxiosResponse, error: Error): boolean => {
        return true;
    }
}
