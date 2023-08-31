import { authApi } from "./auth/authApi";
import { unverifiedCheck } from "./view/unverifiedCheckApi";
import {
  nssiTopologyApi,
  NSSInstanceApi,
  nfvManoPluginApi,
  genericTemplateApi,
  nssTemplateApi,
  tableListApi
} from "./view/viewApi";

export class api {
  static loadAuth() {
    return new authApi(process.env.VUE_APP_BASE_URL_proxyAuth, true);
  }
  static unverified() {
    return new unverifiedCheck(process.env.VUE_APP_BASE_URL_proxyAuth, false);
  }
  static tableList() {
    return new tableListApi(process.env.VUE_APP_BASE_URL_proxyGovd, false);
  }
  static nssTemplate() {
    return new nssTemplateApi(process.env.VUE_APP_BASE_URL_proxyGovd, false);
  }
  static genericTemplate() {
    return new genericTemplateApi(process.env.VUE_APP_BASE_URL_proxyGovd, false);
  }
  static nfvManoPlugin() {
    return new nfvManoPluginApi(process.env.VUE_APP_BASE_URL_proxyGovd, false);
  }
  static NSSInstance() {
    return new NSSInstanceApi(process.env.VUE_APP_BASE_URL_proxyGovd, false);
  }
  static nssiTopology() {
    return new nssiTopologyApi(process.env.VUE_APP_BASE_URL_proxyGovd, false);
  }
  // static nssiTopology() {
  //   return new nssiTopologyApi('', false);
  // }
}
