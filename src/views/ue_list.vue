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
const { alertRef, alertExist } = toRefs(alertConfig);
const columnSort = ['IMSI', 'Teid', 'IP', 'Guti', 'Delete'];

const getTableData = async () => { // 顯示 Table 資料
  console.log("get_data")
  const res = await api.tableList().UEList();
  td_list.value = res.data.fin_data;
  filterEntries.value = td_list.value;
};

const delete_ue = async IMSI => { // Update Modal 內名稱
  console.log("delete_ue")
  console.log(IMSI)
  api.nsSecurity().deleteUe(IMSI);
  await delay(700);
  await getTableData();
  // fileName.value = name;
};

const updateTableData = val => {  // 每次執行 Table 操作，更新資料
  filterEntries.value = val;
};

watch(fileName, () => { text_invalidated.value = false; });
watch(fileData, () => { file_invalidated.value = false; });

onBeforeMount(async () => {

  try {
    await getTableData();
  }
  catch(err) {
    console.log(err);
  }
  await delay(700);
  status.value = true;
});
</script>
