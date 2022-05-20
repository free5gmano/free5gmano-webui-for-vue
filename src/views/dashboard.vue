<template>
  <Table
    :column="th_list"
    :entrie="td_list"
    :columnSort="columnSort"
    :status="status"
    :showBtn="showBtn"
    @update="updateTableData"
  >
    <template v-slot:header>
      <button class="btn btn-primary ms-3 text-white" @click="chageBtn('NFV')">
        <span class="d-none d-sm-inline">
          {{ t("nfv.plugin", ["NFV MANO"]) }}
        </span>
      </button>
      <button class="btn btn-primary ms-2 text-white" @click="chageBtn('VNF')">
        <span class="d-none d-sm-inline"> VNF Template </span>
      </button>
      <button class="btn btn-primary ms-2 text-white" @click="chageBtn('NSD')">
        <span class="d-none d-sm-inline"> NSD Template </span>
      </button>
      <button class="btn btn-primary ms-2 text-white" @click="chageBtn('NRM')">
        <span class="d-none d-sm-inline"> NRM Template </span>
      </button>
    </template>
    <template v-slot:table-name>
      {{ name }}
    </template>
    <template v-slot:table-td>
      <tr v-for="item in filterEntries" :key="item.name">
        <td v-for="i in columnSort" :key="i">{{ item[i] }}</td>
      </tr>
    </template>
  </Table>
</template>
<script setup>
import { useI18n } from "vue-i18n";
import { delay } from "@/assets/js/delay";
import Table from "../components/global/table.vue";
// import { Share } from "@/assets/js/api";
import { ref, onBeforeMount } from "vue";
// const { PluginList } = Share();
const { t } = useI18n();
const showBtn = ref(false);
// const columnNumber = computed(() => a.value.length); // 頁面 tr 個數

const th_list = ref([
  { name: "userName", text: t("base.userName") },
  { name: "name", text: t("nfv.name") },
  { name: "allocate_nssi", text: t("nfv.allocate") },
  { name: "deallocate_nssi", text: t("nfv.deallocate") },
]);

const td_list = ref([
  {
    userName: "NFVO",
    name: "123",
    allocate_nssi: "allocate/main.py",
    deallocate_nssi: "deallocate/main.py",
  },
]);
console.log(td_list);
const status = ref(false);
const filterEntries = ref([]);
const columnSort = ref([
  "userName",
  "name",
  "allocate_nssi",
  "deallocate_nssi",
]);
// const getTableData = async () => {
//   // 顯示 Table 資料
//   const res = await PluginList();
//   console.log(res);
//   td_list.value = res.data;
// };
const updateTableData = (val) => {
  // 每次執行 Table 操作，更新資料
  filterEntries.value = val;
};
const name = ref(t("nfv.plugin", ["NFV MANO", t("list")]));
const chageBtn = (a) => {
  console.log(a);
  if (a == "VNF") {
    name.value = t("generic.template", ["VNF", t("list")]);
    th_list.value = [
      { name: "userName", text: t("newNfv.userName") },
      { name: "name", text: t("newNfv.name") },
      { name: "allocate_nssi", text: t("newNfv.allocate_nssi") },
      { name: "deallocate_nssi", text: t("newNfv.deallocate_nssi") },
    ];
    td_list.value[0].userName = "VNF";
  } else if (a == "NSD") {
    name.value = t("generic.template", ["NSD", t("list")]);
    th_list.value = [
      { name: "userName", text: t("newNfv.userName") },
      { name: "name", text: t("newNfv.name") },
      { name: "allocate_nssi", text: t("newNfv.allocate_nssi") },
      { name: "deallocate_nssi", text: t("newNfv.deallocate_nssi") },
    ];
    td_list.value[0].userName = "NSD";
  } else if (a == "NRM") {
    name.value = t("generic.template", ["NRM", t("list")]);
    th_list.value = [
      { name: "userName", text: t("newNfv.userName") },
      { name: "name", text: t("newNfv.name") },
      { name: "allocate_nssi", text: t("newNfv.allocate_nssi") },
      { name: "deallocate_nssi", text: t("newNfv.deallocate_nssi") },
    ];
    td_list.value[0].userName = "NRM";
  } else if (a == "NFV") {
    name.value = t("generic.template", ["NFV", t("list")]);
    th_list.value = [
      { name: "userName", text: t("base.userName") },
      { name: "name", text: t("nfv.name") },
      { name: "allocate_nssi", text: t("nfv.allocate") },
      { name: "deallocate_nssi", text: t("nfv.deallocate") },
    ];
    td_list.value[0].userName = "NFV";
  }
};
// const a =async () => {
//   console.log(123)
//   status.value = false;
//  await delay(700)
//   status.value = true;
// }
onBeforeMount(async () => {
  // try {
  //   await getTableData();
  // } catch (err) {
  //   console.log(err);
  // }
  await delay(700);
  status.value = true;
});
</script>
