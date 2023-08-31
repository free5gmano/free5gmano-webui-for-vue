<template>
    <main>
      <div class="grid-custom">
        <div class="grid-main-custom" style="overflow: hidden;">
          <router-view v-if="isRouterAlive"></router-view>
        </div>
      </div>
    </main>
    <Header></Header>
    <Sidebar></Sidebar>
</template>
<script setup>
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { api } from '@/apis/api';
// import { useI18n } from 'vue-i18n';
import { useCookies } from "vue3-cookies";
import Header from "./components/global/header.vue";
import Sidebar from "./components/global/sidebar.vue";
// import Cookies from 'js-cookie'
import { ref, watch, provide, nextTick, onMounted, onBeforeMount } from 'vue';
const { cookies } = useCookies();
const uuid = cookies.get('uu_id')
const adminMenuData =  [
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
            name: "List View",
            url: "NS_Instance",
          }
        ],
      },
      {
        name: "Setting",
        icon: "bi bi-bootstrap",
        url: "setting",
        childNodes: [],
      }
    ];
const store = useStore();
const route = useRoute();
store.commit("getuuid", uuid);
const isRouterAlive = ref(true);
// const { locale } = useI18n()
const reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};
provide('reload', reload);
watch(route, () => {
  if(route.path == '/')
    store.commit('changeRoute', 'dashboard');
  else
    store.commit('changeRoute', route.path.slice(1));
});
onBeforeMount(()=>{
  api
  .loadAuth()
  .getRole()
  .then((res) => {
    store.commit("getRole", res.data.role);
    if(res.data.role == 'admin'){
    store.commit("adminMenu",adminMenuData);
  }
  })
  .catch((err) => {
    console.log(err);
  });
  
})
onMounted(() => {
  window.addEventListener("resize", () => {
    store.commit("changeWindowWidth");
  });
  
});
</script>
<style>
ul {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
}
.bg-blue {
  background-color: #4e73df;
  background-image: linear-gradient(180deg, #4e73df 10%, #224abe 100%);
  background-size: cover;
}
.offcanvas-backdrop {
  top: 70px !important;
}
.modal {
  padding: 0 !important;
}
.modal-open {
  padding: 0 !important;
}
.modal-backdrop {
  width: 100% !important;
  height: 100% !important;
}
.offcanvas-backdrop {
  width: 100% !important;
  height: 100% !important;
}
.grid-custom {
  display: grid;
  grid-template-rows: 70px 1fr;
  grid-template-columns: 1fr;
}
.grid-main-custom {
  grid-row: 2 / 3;
  grid-column: 1 / 2;
}
.tablecell-custom {
  min-width: 150px;
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
@media (min-width: 576px) {
  .grid-custom {
    grid-template-columns: 102px 1fr;
  }
  .grid-main-custom {
    grid-column: 2 / 3;
  }
}
@media (min-width: 768px) {
  .grid-custom {
    grid-template-columns: 224px 1fr;
  }
}
</style>