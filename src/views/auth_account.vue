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
      <button class="btn btn-primary ms-3 text-white">
        <span class="d-none d-sm-inline">
          {{ t("nfv.plugin", ["NFV MANO"]) }}
        </span>
      </button>
    </template>
    <template v-slot:table-name>
      {{ t("AuthAccount", [t("list")]) }}
      <!-- {{ t("nfv.plugin", ["NFV MANO", t("list")]) }} -->
      <button class="btn btn-primary ms-3 text-white" @click="compiler">
        <span class="d-none d-sm-inline"> 編輯 </span>
      </button>
    </template>
    <template v-slot:table-td>
      <tr v-for="item in filterEntries" :key="item.id">
        <td v-for="i in columnSort" :key="i">
          <span v-if="i != 'authaccount'"> {{ item[i] }} </span>

          <div
            v-else
            class="
              align-items-center
              justify-content-center
              form-check form-switch
            "
          >
            <input
              class="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              @click="authaccountBtn(item)"
              v-model="authaccount"
            />
          </div>
        </td>
      </tr>
    </template>
  </Table>
  <div class="col-2 my-2 mx-4" style="float: right" v-if="isShow">
    <button
      class="btn btn-primary ms-3 text-white"
      style="float: right"
      @click="yes"
    >
      <span class="d-none d-sm-inline"> 確定 </span>
    </button>
    <button class="btn btn-primary ms-3 text-white" style="float: right">
      <span class="d-none d-sm-inline"> 取消 </span>
    </button>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { delay } from "@/assets/js/delay";
import Table from "../components/global/table.vue";
import { api } from "../apis/api.js";
import { ref, onBeforeMount } from "vue";
// const { PluginList } = Share();
const { t } = useI18n();
const showBtn = ref(false);
const th_list = ref([
  { name: "id", text: t("id") },
  { name: "username", text: t("UserName") },
  { name: "join_data", text: t("join_data") },
  { name: "last_login", text: t("last_login") },
  // { name: "email", text: t("email") },
]);
const td_list = ref([
  {
    id: 3,
    username: "test2",
    join_data: "2022-04-27 12:19",
    last_login: "2022-04-27 12:20",
    // email: "123@gmail.com",
  },
  {
    id: 4,
    username: "test3",
    join_data: "2022-04-27 12:19",
    last_login: "2022-04-29 09:50",
    // email: "123@gmail.com",
  },
]);
const status = ref(false);
const filterEntries = ref([]);
const sent = ref([]);
const authaccount = ref([])
const columnSort = ref(["id", "username", "join_data", "last_login"]);
const updateTableData = (val) => {
  filterEntries.value = val;
  console.log(val);
};
onBeforeMount(async () => {
  try {
    const res = await api.unverified().unverifiedList();
    td_list.value = res.data.data;
    console.log(res);
    // await getTableData();
  } catch (err) {
    console.log(err);
  }
  await delay(700);
  status.value = true;
});
const isShow = ref(false);
const isNotShow = ref(true);
const compiler = () => {
  isShow.value = true;
  isNotShow.value = false;
  th_list.value.push({ name: "authaccount", text: t("authaccount") });
  columnSort.value.push("authaccount");
};

const authaccountBtn = (item) => {
  console.log(item)
  sent.value.push(item.username);
  console.log(sent)
  
};

const yes = () => { 
  api.unverified().adminCheck({"names":sent.value})
  .then((res) =>{
    console.log(res)
  })
};
</script>