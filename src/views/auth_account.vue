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
      <button class="btn btn-primary ms-3 text-white" :disabled="isShow" @click="compiler">
        <span class="d-none d-sm-inline"> 編輯 </span>
      </button>
     
    </template>
    <template v-slot:table-name>
       <span class="d-none d-sm-inline">
        Account List
      </span>
    </template>
    <template v-slot:table-td>
      <tr v-for="item in filterEntries" :key="item.id">
        <td v-for="i in columnSort" :key="i">
          <span v-if="i != 'authaccount'"> {{ item[i] }} </span>

          <div
            v-else
            class="align-items-center justify-content-center form-check form-switch"
          >
            <input
              class="form-check-input cursor-pointer"
              type="checkbox"
              :id="item.id"
              @click="authaccountBtn(item)"
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
    <button class="btn btn-primary ms-3 text-white" style="float: right" @click="cancel">
      <span class="d-none d-sm-inline"> 取消 </span>
    </button>
  </div>
</template>

<script setup>
// import { useI18n } from "vue-i18n";
import { delay } from "@/assets/js/delay";
import Table from "../components/global/table.vue";
import { api } from "../apis/api.js";
import { ref, onBeforeMount } from "vue";
// const { t } = useI18n();
const showBtn = ref(false);
const th_list = ref([
  { name: "id", text: "id" },
  { name: "username", text: "UserName" },
  { name: "join_data", text: "join_data" },
  { name: "last_login", text: "last_login" },
]);
const td_list = ref([]);
const status = ref(false);
const filterEntries = ref([]);
const sent = ref([]);
const columnSort = ref(["id", "username", "join_data", "last_login"]);
const updateTableData = (val) => {
  filterEntries.value = val;
  console.log(val);
};
const dataList = async ()=>{
    const res = await api.unverified().unverifiedList();
    td_list.value = res.data.data;
}
const cancel = () => {
isShow.value = false
}
onBeforeMount(async () => {
  try {
      await dataList()
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
  th_list.value.push({ name: "authaccount", text: "authaccount" });
  columnSort.value.push("authaccount");
};

const authaccountBtn = (item) => {
  if (sent.value.indexOf(item.username) != -1) {
    const index = sent.value.indexOf(item.username);
    sent.value.splice(index, 1);
  } else {
    sent.value.push(item.username);
  }
};

const yes = () => {
  if (sent.value.length > 0) {
    api
      .unverified()
      .adminCheck({ names: sent.value })
      .then((res) => {
        console.log(res);
        isShow.value = false
        dataList()
      });
  }
};
</script>
