import { createStore } from 'vuex'
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
// import { api } from '../apis/api'
export default createStore({
  state: {
    uuid: "",
    windowWidth: window.innerWidth,
    currentRoute: "",
    menuData: [
      {
        name: "Dashboard",
        icon: "bi bi-clipboard",
        url: "dashboard",
        childNodes: [],
      },
      {
        name: "NFV MANO Plugin",
        icon: "bi bi-award",
        url: "nfv_mano_plugin",
        childNodes: [],
      },
      {
        name: "Generic Template",
        icon: "bi bi-bell",
        url: "generic_template",
        childNodes: [
          {
            name: "VNF Template",
            url: "vnf_template",
          },
          {
            name: "NSD Template",
            url: "nsd_template",
          },
          {
            name: "NRM Template",
            url: "nrm_template",
          },
        ],
      },
      {
        name: "NSS Template",
        icon: "bi bi-bootstrap",
        url: "nss_template",
        childNodes: [],
      },
      {
        name: "NSSI View",
        icon: "bi bi-brightness-high",
        url: "nssi_view",
        childNodes: [
          {
            name: "Graph View",
            url: "nssi_topology",
          },
          {
            name: "List View",
            url: "NSS_Instance",
          },
        ],
      },
      {
        name: "Setting",
        icon: "bi bi-bootstrap",
        url: "setting",
        childNodes: [],
      },
    ],
    localeLang: "",
  },
  mutations: {
    updateUuid(state) {
      state.uuid = cookies.get("uuid");
    },
    changeLoginStatus(state) {
      state.loginStatus = !state.loginStatus;
    },
    changeWindowWidth(state) {
      state.windowWidth = window.innerWidth;
    },
    changeRoute(state, payload) {
      state.currentRoute = payload;
    },
    changeLocaleLang(state, payload) {
      state.localeLang = payload;
    },
  },
  actions: {},
  modules: {},
});
