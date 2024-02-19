import { createStore } from 'vuex'
// import { api } from '../apis/api'
export default createStore({
  state: {
    windowWidth: window.innerWidth,
    currentRoute: '',
    role: '',
    uuid:'',
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
        name: "NSI View",
        icon: "bi bi-brightness-high",
        url: "nsi_view",
        childNodes: [
          {
            name: "Graph View",
            url: "nsi_topology",
          },
          {
            name: "List View",
            url: "NS_Instance",
          },
        ],
      },
      {
        name: "NS Security",
        icon: "bi bi-award",
        url: "ns_security",
        childNodes: [],
      },
      {
        name: "Setting",
        icon: "bi bi-bootstrap",
        url: "setting",
        childNodes: [],
      }
    ],
    localeLang:''
  },
  mutations: {
    changeLoginStatus(state) {
      state.loginStatus = !state.loginStatus;
    },
    changeWindowWidth(state) {
      state.windowWidth = window.innerWidth;
    },
    changeRoute(state,payload) {
      state.currentRoute = payload;
    },
    changeLocaleLang(state,payload) {
      state.localeLang = payload;
    },
    getRole(state,payload) {
      state.role = payload;
    },
    getuuid(state,payload) {
      state.uuid = payload;
    },
    adminMenu(state,payload) {
      state.menuData = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
