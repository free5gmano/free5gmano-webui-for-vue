<template>
  <div id="nav-offcanvas" class="offcanvas offcanvas-end offcanvas-custom" ref="offcanvas_ref">
    <ul id="accordion-basic">
      <li v-for="item in menuData" :key="item.name">
        <template v-if="item.childNodes.length > 0">
          <div class="list-item" :class="{ 'currentRoute' : routeStatus(item.url, currentRoute) }" data-bs-toggle="collapse" :data-bs-target="'#' + item.url">
            <i class="me-2" :class="item.icon"></i>
            {{ item.name }}
          </div>
          <div :id="item.url" class="collapse" :ref="item.url + '_xs'" data-bs-parent="#accordion-basic">
            <ul class="list-ul">
              <li v-for="child in item.childNodes" :key="child.name">
                <a class="list-item" :class="{ 'currentRoute' : child.url == currentRoute }" @click="closeCollapse(), routerEvent(child.url)"> {{ child.name }} </a>
              </li>
            </ul>
          </div>
        </template> 
        <template v-else>
          <a class="list-item" :class="{ 'currentRoute' : item.url == currentRoute }" @click="closeCollapse(), routerEvent(item.url)">
            <i class="me-2" :class="item.icon"></i>
            {{ item.name }}
          </a>
        </template>
      </li>
    </ul>
  </div>
</template>
<script setup>
import router from '@/router';
import { useStore } from "vuex";
import { ref, watch, inject, computed, onMounted } from 'vue';
import { Collapse, Offcanvas } from 'bootstrap/dist/js/bootstrap.bundle.js';
const store = useStore();
const nssi_view = ref('');
const nssi_view_xs = ref(null);
const offcanvas = ref('');
const offcanvas_ref = ref(null);
const generic_template = ref('');
const generic_template_xs = ref(null);
const reload = inject('reload');
const menuData =  computed(() => store.state.menuData);
const currentRoute =  computed(() => store.state.currentRoute);
const currentWindowWidth = computed(() => store.state.windowWidth);

const routerEvent = url => {
  if(url == currentRoute.value)
    reload();
  else
    router.push({ path : '/' + url });
};
const routeStatus = (url, route) => {
  const index = menuData.value.findIndex(e => e.url == url);
  if(menuData.value[index].childNodes.findIndex(e => e.url == route) != -1)
    return true;
  else
    return false;
};
const closeCollapse = () => {
  offcanvas.value.hide();
  nssi_view.value.hide();
  generic_template.value.hide();
};

watch(currentWindowWidth, (newVal) => {
  if(newVal >= 576) 
    closeCollapse();
});

onMounted(() => {
  offcanvas.value = new Offcanvas(offcanvas_ref.value, {});
  nssi_view.value = new Collapse(nssi_view_xs.value, { toggle : false });
  generic_template.value = new Collapse(generic_template_xs.value, { toggle : false });
});
</script>
<style scoped>
.offcanvas-custom {
  top: 70px;
  width: 180px;
}
.list-item {
  display: flex;
  color: #000;
  font-size: 12px;
  cursor: pointer;
  align-items: center;
  text-decoration: none;
  padding: 1rem 0 1rem 1rem;
  border-bottom: #e5e5e5 1px solid;
}
.list-item:hover {
  background-color: #dedede !important;
}
.list-item:active {
  background-color: #d1d1d1 !important;
}
.list-ul {
  background-color:#efefef;
}
.list-ul li:not(:last-child) {
  border-bottom: #FFF 1px solid;
}
.currentRoute {
  font-weight: 800;
}
.currentRoute:hover {
  background-color: #d3d3d3 !important;
}
.currentRoute:active {
  background-color: #c5c5c5 !important;
}
</style>