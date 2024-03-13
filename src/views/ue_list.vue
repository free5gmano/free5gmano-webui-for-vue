<template>
  <Table
    :column="th_list"
    :entrie="td_list"
    :columnSort="columnSort"
    :status="status"
    @update="updateTableData"
  >
    <template v-slot:header>
      <h3>
        UE List
      </h3>
    </template>
    <template v-slot:button>
      <!-- <button @click="getAbnormalLog()"> -->
        Get abnormal log
      <!-- </button> -->
    </template>
    <!-- <button @click="getAbnormalLog">Get abnormal log</button> -->
    <template v-slot:table-name>
      {{ t(("UE list")) }}
    </template>
    <template v-slot:table-td>
      <tr v-for="item in filterEntries" :key="item.name">
        <td class="tablecell-custom">{{ item.IMSI }}</td>
        <td class="tablecell-custom">{{ item.Teid }}</td>
        <td class="tablecell-custom">{{ item.IP }}</td>
        <td class="tablecell-custom">{{ item.Guti }}</td>
        <td class="w-0">
          <div class="d-flex justify-content-center align-items-center text-white cursor-pointer mx-auto" style="width:30px; height:30px" @click="delete_ue(item.IMSI)">
            <img src="../assets/delete.png"  style="width:30px; height:30px" alt="">
          </div>
        </td>
      </tr>
    </template>
  </Table>
  <div class="d-flex flex-column p-4 user-select-none">
  <h3>
    Abnormal traffic
  </h3>
  <div style="width: 100%; height: 100vh; margin: 0; padding: 0;">
    <iframe
      src="http://10.20.1.43:3000/d-solo/ddff35deptkw0e/ip?orgId=1&from=1710209338014&to=1710230938014&panelId=1"
      frameborder="0"
      style="width: 100%; height: 100%; border: none;"
    ></iframe>
  </div>
  </div>
  <Modalcreate>
  <template v-slot:header>
    {{ "Abnormal Logs" }}
  </template>
  <template v-slot:body>
    <div v-for="(log, index) in abnormalLog" :key="index">
      {{ log }}
    </div>
  </template>    
</Modalcreate>
  <Alert ref="alertRef" v-show="alertExist"></Alert>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { delay } from '@/assets/js/delay';
import Table from '../components/global/table.vue';
import { alertConfig } from '@/assets/js/alertData';
import { api } from '../apis/api';
import { ref, toRefs, watch, onBeforeMount, defineAsyncComponent } from 'vue';
import { text_invalidated, file_invalidated} from '@/assets/js/validate';
const Alert = defineAsyncComponent(() => import(/* webpackChunkName: "Alert" */ '../components/global/alert.vue'));
const Modalcreate = defineAsyncComponent(() => import(/* webpackChunkName: "Modalcreate" */ '../components/global/modal-create.vue'));
const { t } = useI18n();
const th_list = [
  { name: "IMSI", text: `IMSI` },
  { name: "Teid", text: `Teid` },
  { name: "IP", text: `IP` },
  { name: "Guti", text: `Guti` },
  { name: "Delete", text: `Delete` },
];
const td_list = ref([]);
const fileName = ref('');
const fileData = ref({});
const status = ref(false);
const filterEntries = ref([]);
const abnormalLog = ref([]);
const { alertRef, alertExist } = toRefs(alertConfig);
const columnSort = ['IMSI', 'Teid', 'IP', 'Guti', 'Delete'];

const getTableData = async () => { // 顯示 Table 資料
  console.log("get_data")
  const res = await api.tableList().UEList();
  td_list.value = res.data.fin_data;
  filterEntries.value = td_list.value;
};

// const getAbnormalLog = async () => {
//   console.log("get_abnormal_log")
//   const res = a
// }


const delete_ue = async IMSI => { // Update Modal 內名稱
  console.log("delete_ue")
  console.log(IMSI)
  api.nsSecurity().deleteUe(IMSI);
  await delay(700);
  await getTableData();
  // fileName.value = name;
};

const processAbnormalLog = data => {
  return data.fin_data.map(entry => {
    const [source, destination] = entry.split("->");
    const sourceUE = source.split(":")[0];
    return `UE(${sourceUE}) 送往${destination} 疑似為攻擊行為`;
  });
};

const getAbnormalLog = async () => {
  console.log("get_abnormal_log");
  try {
    const res = await api.tableList().abnormalUE();
    console.log(res.data);
    abnormalLog.value = processAbnormalLog(res.data);
  } catch (error) {
    abnormalLog.value = ["Error occurred while fetching abnormal log."];
    console.error("Error fetching abnormal log:", error);
  }
};

// const getAbnormalLog = async () => {
//   console.log("get_abnormal_log")
//   try {
//     const res = await api.tableList().abnormalUE();
//     console.log(res.data)
//     abnormalLog.value = res.data
//   } catch(error){
//     abnormalLog.value = "test"
//     console.log(abnormalLog.value)
//   }

// const getAbnormalLog = async () => {
//   console.log("get_abnormal_log")
//   try {
//     const res = await api.getAbnormalLog();
//     console.log(res.data)
//     abnormalLog.value = res.data
//   } catch(error){
//     abnormalLog.value = "test"
//     console.log(abnormalLog.value)
//   }
  
  
  
  // try {
  //   const res = await api.getAbnormalLog(); // 假設這是一個從後端獲取異常日誌資料的 API
  //   if (res.data) {
  //     // 如果後端返回資料，則將資料顯示在彈出視窗中，這裡假設資料是一個字串
  //     showAlert(res.data);
  //   } else {
  //     showAlert("No abnormal log found."); // 如果後端沒有返回資料，則顯示提示訊息
  //   }
  // } catch (error) {
  //   console.error("Error fetching abnormal log:", error);
  //   showAlert("Error fetching abnormal log. Please try again later."); // 如果發生錯誤，則顯示錯誤訊息
  // }
// };

// const showAlert = message => {
//   // 透過 alertRef 來控制彈出視窗的顯示
//   alertRef.value.showAlert(message);
// };

const updateTableData = val => {  // 每次執行 Table 操作，更新資料
  filterEntries.value = val;
};

watch(fileName, () => { text_invalidated.value = false; });
watch(fileData, () => { file_invalidated.value = false; });

onBeforeMount(async () => {

  try {
    await getTableData();
    await getAbnormalLog();
  }
  catch(err) {
    console.log(err);
  }
  await delay(700);
  status.value = true;
});
</script>
