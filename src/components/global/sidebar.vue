<template>
  <aside class="sidebar-custom bg-blue">
    <ul id="sidebar-parent" class="text-white">
      <li class="position-relative" v-for="item in menuData" :key="item.name">
        <template v-if="item.childNodes.length > 0">
          <a class="list-item" :class="{ 'currentRoute' : routeStatus(item.url, currentRoute) }" data-bs-toggle="collapse" :data-bs-target="'#' + item.url" @click="url(item.url)">{{ item.name }}
            <i v-if="currentWindowWidth >= 768" :class="[[ item.url == clickUrl ? 'bi bi-chevron-up' : 'bi bi-chevron-down' ], 'ms-auto']"></i>
          </a>
          <template v-if="currentWindowWidth >= 768">
            <div :id="item.url" class="collapse collapse-item" :ref="item.url + '_md'" data-bs-parent="#sidebar-parent">
              <ul class="p-2">
                <li v-for="child in item.childNodes" :key="child.name">
                  <a class="list-item" :class="{ 'currentRouteCollapseItem' : child.url == currentRoute }" @click="closeCollapse(), routerEvent(child.url)"> {{ child.name }} </a>
                </li>
              </ul>
            </div>
          </template>
          <template v-else-if="currentWindowWidth >= 576 && currentWindowWidth < 768">
            <div :id="item.url" class="collapse collapse-item" :ref="item.url + '_sm'" data-bs-parent="#sidebar-parent">
              <ul class="p-2">
                <li v-for="child in item.childNodes" :key="child.name">
                  <a class="list-item" :class="{ 'currentRouteCollapseItem' : child.url == currentRoute }" @click="closeCollapse(), routerEvent(child.url)"> {{ child.name }} </a>
                </li>
              </ul>
            </div>
          </template>
        </template>
        <template v-else>
          <a class="list-item" :class="{ 'currentRoute' : item.url == currentRoute }" @click="closeCollapse(), routerEvent(item.url)">{{ item.name }}</a>
        </template>
      </li>
    </ul>
  </aside>
</template>
<script setup>
import { useStore } from "vuex";
import { useRouter } from 'vue-router';
import { ref, watch, computed, inject } from 'vue';
import { Collapse } from 'bootstrap/dist/js/bootstrap.bundle.js';
const store = useStore();
const router = useRouter();
const clickUrl = ref('');
const reload = inject('reload');
const nssi_view_sm = ref(null);
const nssi_view_md = ref(null);
const nssi_view_md_ref = ref('');
const nssi_view_sm_ref = ref('');
// const nsi_view_sm = ref(null);
// const nsi_view_md = ref(null);
// const nsi_view_md_ref = ref('');
// const nsi_view_sm_ref = ref('');
const generic_template_sm = ref(null);
const generic_template_md = ref(null);
const generic_template_md_ref = ref('');
const generic_template_sm_ref = ref('');
const menuData =  computed(() => store.state.menuData);
const currentRoute =  computed(() => store.state.currentRoute);
const currentWindowWidth = computed(() => store.state.windowWidth);
const url = url => {
  if(url == clickUrl.value)
    clickUrl.value = '';
  else
    clickUrl.value = url;
};
const routerEvent = url => {
  if(url == currentRoute.value)
    reload();
  else
    router.push({ path : '/' + url });
};
const routeStatus = (url,route) => {
  const index = menuData.value.findIndex(e => e.url == url);
  if(menuData.value[index].childNodes.findIndex(e => e.url == route) != -1)
    return true;
  else
    return false;
};
const closeCollapse = () => {
  if(currentWindowWidth.value >= 768) {
    clickUrl.value = '';
    nssi_view_md_ref.value = new Collapse(nssi_view_md.value, { toggle: false });
    generic_template_md_ref.value = new Collapse(generic_template_md.value, { toggle: false });
    nssi_view_md_ref.value.hide();
    generic_template_md_ref.value.hide();
  }
  else {
    nssi_view_sm_ref.value = new Collapse(nssi_view_sm.value, { toggle: false });
    generic_template_sm_ref.value = new Collapse(generic_template_sm.value, { toggle: false });
    nssi_view_sm_ref.value.hide();
    generic_template_sm_ref.value.hide();
  }
};

watch(currentWindowWidth, (newVal) => {
  if(newVal < 768) 
    clickUrl.value = '';
});
</script>
<style scoped>
.sidebar-custom {
  display: none;
  position: fixed;
  top: 70px;
  bottom: 0;
}
.list-item {
  display: flex;
  width: 102px;
  color: white;
  font-size: .65rem;
  padding: 12px 16px;
  text-align: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
}
.collapse-item {
  position: absolute;
  top: 15px;
  left: 110px;
  z-index: 20;
  box-shadow: 0 0.15rem 1.75rem 0 rgb(58 59 69 / 15%);
  border-radius: 5px;
  background-color: #FFF;
}
.collapse-item .list-item {
  width: 100%;
  color: black;
  padding: .75rem 1rem;
  border-radius: 5px;
  white-space: nowrap;
}
.collapse-item .list-item:hover {
  background-color: #F5F5F5;
}
.collapse-item .list-item:active {
  background-color: #DCDCDC;
}
.currentRoute {
  font-size: .75rem;
  font-weight: 900;
}
.currentRouteCollapseItem {
  font-weight: 800;
  background-color: #E9EBEB;
}
.currentRouteCollapseItem:hover {
  background-color: #DDDEDE !important;
}
.currentRouteCollapseItem:active {
  background-color: #B8BBBC !important;
}
@media (min-width: 576px) {
  .sidebar-custom {
    display: block;
    width: 102px;
  }
}
@media (min-width: 768px) {
  .sidebar-custom {
    width: 224px;
  }
  .list-item {
    width: 224px;
    padding: 19px;
    justify-content: start;
  }
  .collapse-item {
    position: relative;
    margin: 0 1rem;
    top: 0;
    left: 0;
  }
}
</style>