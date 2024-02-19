<template>
  <Table :column="th_list" :entrie="td_list" :columnSort="columnSort" :status="status" :showBtn="false" @update="updateTableData">
    <template v-slot:header>
      <h3>
        Network SASE Gateway
      </h3>
      <!-- Network Slice Security -->
    </template>
    <template v-slot:table-name>
      {{ `NS ${ t('list') }` }}
      <!-- NSSI List -->
    </template>
    <template v-slot:table-td>
      <tr v-for="item in filterEntries" :key="item.templateId">
        <td  class="tablecell-custom">
          <i class="bi bi-list cursor-pointer me-1" data-bs-toggle="modal" data-bs-target="#show_plugin_Modal" @click="show_template_button(item.nssiId, item.nsInfo)"></i>
          {{ item.nssiId }}
        </td>
        <td class="tablecell-custom">{{ item.nsInstanceName }}</td>
        <!-- <td class="tablecell-custom">{{ item.administrativeState }}</td> -->
        <td class="tablecell-custom">{{ item.operationalState }}</td>
        <td class="w-0">
          <div class="d-flex justify-content-center align-items-center text-white cursor-pointer mx-auto" style="width:30px; height:30px" @click="showGraph(item.nssiId, item.nsInstanceName)">
            <img src="../assets/topology_icon.png"  style="width:30px; height:30px" alt="">
          </div>
        </td>
        <!-- <td class="w-0">
          <div class="d-flex justify-content-center align-items-center text-white cursor-pointer mx-auto bg-warning rounded-circle" style="width:30px; height:30px" data-bs-toggle="modal" data-bs-target="#Deallocate_plugin_Modal"  @click="Deallocate_NSSI_button(item.nssiId)">
            <i class="bi bi-exclamation-triangle"></i>
          </div>
        </td> -->
        <td class="w-0">
          <div class="d-flex justify-content-center align-items-center text-white cursor-pointer mx-auto" style="width:30px; height:30px" @click="showUEList()">
            <img src="../assets/user.png"  style="width:30px; height:30px" alt="">
          </div>
        </td>
        <td class="w-0">
            <div class="d-flex justify-content-center align-items-center text-white cursor-pointer mx-auto" style="width:30px; height:30px" @click="showFW()">
              <img src="../assets/firewall.png"  style="width:30px; height:30px" alt="">
            </div>
          </td>
      </tr>
    </template>
  </Table>
  <Modalshow ref="modalShow" @remove="removeShowData">
    <template v-slot:header>
      {{`VNF ${ t('Instance') }`}}
      <!-- VNF Instance -->
    </template>
    <template v-slot:body>
      <form>
        <div class="mb-3">
          <label for="InputFile" class="form-label">
            {{`${ t('NSSI') }${ t('ID') } :`}}
            <!-- Network Slice Subnet Instance ID: -->
          </label>
          <input type="text" class="form-control" id="InputFile" placeholder="請輸入 Plugin 名稱" v-model="nssiId" readonly>
        </div>
        <div class="table-responsive">
          <table class="table table-bordered table-striped table-hover align-middle mb-0">
            <thead>
              <tr>
                <th scope="col" class="table-light cursor-pointer col-1">
                  {{`VNF ${ t('Name') }`}}
                  <!-- VNF Name -->
                </th>
                <th scope="col" class="table-light cursor-pointer col-1">
                  {{`VNF ${ t('Provider') }`}}
                  <!-- VNF Provider -->
                </th>
                <th scope="col" class="table-light cursor-pointer col-1">
                  {{t('generic.status', ['VNF'])}}
                  <!-- VNF State -->
                </th>
                <th scope="col" class="table-light cursor-pointer col-1">
                  {{`VNF IP ${ t('Addresses') }`}}
                  <!-- VNF IP Addresses -->
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-if="vnfInstance">
                <tr v-for="item in vnfInstance" :key="item.id">
                  <td class="tablecell-custom">{{ item.vnfProductName }}</td>
                  <td class="tablecell-custom">{{ item.vnfProvider }}</td>
                  <td class="tablecell-custom">{{ item.vnfState }}</td>
                  <td class="tablecell-custom">{{ item.Addresses }}</td>
                </tr>
              </template>
              <template v-else>
                <tr class="text-center">
                  <td :colspan="4">
                    {{ t('nssi.notVNFInformation') }}
                    <!-- No VNF Information !! -->
                  </td>  
                </tr>
              </template>
            </tbody>
          </table>          
        </div>
      </form>
    </template>
  </Modalshow>
  <!-- <Modaldelete ref="modalDelete" @delete="delete_NSSI_modal" @remove="removeDeleteData">
    <template v-slot:header>
      {{ t('nssi.delete') }}
    </template>
  </Modaldelete> -->
  <Alert ref="alertRef" v-show="alertExist"></Alert>
  <div class="modal fade" id="Deallocate_plugin_Modal" ref="modal_Deallocate" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ t('nssi.deallocate') }}
            <!-- Deallocate NSSI -->
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body mx-1">
          {{ t('nssi.SureDeallocate') }}
          <!-- Sure to deallocate NSSI ? -->
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            {{ t('Cancel') }}
          </button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="Deallocate_plugin">
            {{ t('Deallocate') }}
            <!-- Deallocate -->
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import router from '@/router';
import { useI18n } from 'vue-i18n';
import { delay } from '@/assets/js/delay';
// import { closeModal } from '@/assets/js/closeModel';
import { api } from '../apis/api';
import Table from '../components/global/table.vue';
// import { alertConfig, alertEvent } from '@/assets/js/alertData';
import { alertConfig} from '@/assets/js/alertData';
// import { ref, toRefs, reactive, onBeforeMount, defineAsyncComponent } from 'vue';
import { ref, toRefs, onBeforeMount, defineAsyncComponent } from 'vue';
const { t } = useI18n();
const { alertRef, alertExist } = toRefs(alertConfig);
const Modalshow = defineAsyncComponent(() => import(/* webpackChunkName: "Modalshow" */ '../components/global/modal-show.vue'));
// const Modaldelete = defineAsyncComponent(() => import(/* webpackChunkName: "Modaldelete" */ '../components/global/modal-delete.vue'));
const Alert = defineAsyncComponent(() => import(/* webpackChunkName: "Alert" */ '../components/global/alert.vue'));
const status = ref(false);
const th_list = [
  { name: "nssiId", text: `Network Slice Instance (NSI)` },
  { name: "nsInstanceName", text: `${ t('Network') }${ t('Service') }(NS)` },
//   { name: "administrativeState", text: t('generic.status', [t('Administrative')]) },
  { name: "operationalState", text: t('generic.status', [t('Operational')]) },
  { name: "Graph", text: t("Graph") },
  { name: "UE", text: `UE List` },
  { name: "Firewall", text: `Firewall` },
//   { name: "Delete_NSSI", text: t('nssi.delete') },
];
const td_list = ref([]);
// const modalDelete = ref(null);
const nssiId = ref('');
const vnfInstance = ref([]);
const filterEntries = ref([]);
const Deallocate_NSSI_ID = ref('');
const columnSort = ["nssiId", "nsInstanceName", "administrativeState", "operationalState"];
// const deleteData = reactive({
//   id: null,
//   status: null,
// });
  
const nss_instance_list = async () => {
  const res = await api.NSSInstance().nssInstanceIist();
  td_list.value = [];
  for(const i of res.data.attributeListOut) {
    const obj = {
      nssiId: i.nssiId,
      nsInstanceName: '',
      administrativeState: i.administrativeState,
      operationalState: i.operationalState,
      nsInfo: i.nsInfo,
      nssi_status: '',
    };
    if(i.nsInfo) {
      obj.nsInstanceName = i.nsInfo.nsInstanceName;
      obj.nssi_status = 'running';
      // obj.nsInfo=i.nsInfo
    }
    else {
      obj.nsInstanceName = 'null';
      obj.nssi_status = 'deallocated';
      // obj.nsInfo=null
    }
    td_list.value.push(obj);
  }
};
const show_template_button = (id, nsInfo) => {
  nssiId.value = id;
  if(nsInfo) {
    let tojson = nsInfo.vnfInstance.replace(/'/g, '"').replace(/:[ ]*False/g, ":false").replace(/:[ ]*True/g, ":true").replace(/:[ ]*None/g, ":null");
    let vnfInstanceJson = JSON.parse(tojson);
    // if(vnfInstanceJson.length){
      let vnfIp ;
      for(const iterator of vnfInstanceJson) {
        const obj = {
          vnfProductName: iterator.vnfProductName,
          vnfProvider: iterator.vnfProvider,
          vnfState: iterator.instantiatedVnfInfo.vnfState,
          Addresses: "",
        };
        for(const i of iterator.instantiatedVnfInfo.extCpInfo) {
          if (i.cpdId == "CP2") {
            vnfIp = i.cpProtocolInfo[0].ipOverEthernet.ipAddresses[0].addresses;
            // obj.Addresses = i.cpProtocolInfo[0].ipOverEthernet.ipAddresses[0].addresses;
          }
        }
        obj.Addresses = vnfIp; 
        vnfInstance.value.push(obj);
      }
    // }
    // else{
    //   let result_array = Object.values(vnfInstanceJson);
    //   
    // }
  }
  else
    vnfInstance.value = null;
};
const removeShowData = () => { // 關閉 Show Modal
  nssiId.value = '';
  vnfInstance.value = [];
};
const updateTableData = val => { // 每次執行 Table 操作，更新資料 
  filterEntries.value = val;
};
const showGraph = (id, status) => {
  if(status != 'null')
    router.push({ path:'/nssi_topology/', query: { id: id, status: 'show'}});
};
const showUEList = () => {
  router.push({ path:'/ue_list'});
};
const showFW = () => {
  console.log("in FW")
  router.push({ path:'/showfirewall'});
};
// const Deallocate_NSSI_button = id => {
//   Deallocate_NSSI_ID.value = id;
// };
const Deallocate_plugin = () => {
  router.push({ path:'/nssi_topology/', query: { id: Deallocate_NSSI_ID.value, status: 'deallocate'}});
};
// const delete_NSSI_button = (id, status) => { // 點擊 Delete Modal 按鈕
//   deleteData.id = id;
//   deleteData.status = status;
// }
// const delete_NSSI_modal = () => {
//   const alertData = {
//     Template: `NSSI`,
//     configSuccess: t('Delete'),
//     configUnsuccess: t('deallocated'),
//   };
//   if(deleteData.status == 'deallocated') {
//     api.NSSInstance().deleteNssi(deleteData.id)
//     .then(() => {
//       nss_instance_list();
//       alertEvent(1, alertData.Template, alertData.configSuccess, true);
//     });
//     closeModal(modalDelete.value)
//   }
//   else 
//     alertEvent(0, alertData.Template, alertData.configUnsuccess, true);
// };
// const removeDeleteData = () => {
//   deleteData.id = null;
//   deleteData.status = null;
// };

onBeforeMount(async () => {
  try {
    await nss_instance_list();
  }
  catch(err) {
    console.log(err);
  }
  await delay(700);
  status.value = true;
});
</script>
