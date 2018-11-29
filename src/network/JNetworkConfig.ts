/**
 * Created by cuppi on 2017/4/14.
 */
import NetworkManager from './JNetwork';
import {UseConfig as UseUrlConfig} from '../unify/JUrlList'
import {UseConfig as UseDataConfig} from '../unify/JDataUnify'
import {defaultInterceptor} from "../delegate/NetworkDelegate";

/**
 * 请求配置类
 * @memberOf module:network
 */
class JNetworkConfig {
  static setConfig(config){
    NetworkManager.baseUrl = config.baseUrl;
    NetworkManager.delegate = {...defaultInterceptor, ...config.delegate};
    NetworkManager.carryData = config.carryData;
    NetworkManager.axiosConfig = config.axiosConfig;
    let {urlMap, dataMap} = config;
    if (!urlMap || !dataMap){
      console.log('Didn\'t find out the urlMap value or dataMap, do you forget it?')
    } else {
      UseUrlConfig(urlMap);
      UseDataConfig(dataMap);
    }
  }
}

export default JNetworkConfig;
