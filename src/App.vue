<template>
  <main>
    <div class="grid-custom">
      <div class="grid-main-custom" style="overflow: hidden">
        <router-view v-if="isRouterAlive"></router-view>
      </div>
    </div>
  </main>
  <Header></Header>
  <Sidebar></Sidebar>
</template>
<script setup>
import { useStore } from "vuex";
import { useRoute } from "vue-router";

// import { useI18n } from 'vue-i18n';
import Header from "./components/global/header.vue";
import Sidebar from "./components/global/sidebar.vue";
import { ref, watch, provide, nextTick, onMounted } from "vue";
console.log(process.env);

const store = useStore();
store.commit("updateUuid");
console.log(store.state.uuid)
if(store.state.uuid) {
  //COOKIES已過期
}

const route = useRoute();
const isRouterAlive = ref(true);
// const { locale } = useI18n()
const reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};
provide("reload", reload);
watch(route, () => {
  if (route.path == "/") store.commit("changeRoute", "dashboard");
  else store.commit("changeRoute", route.path.slice(1));
});
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
