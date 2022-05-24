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
        {{ t("nfv.plugin", ["NFV MANO"]) }}
      </h3>
    </template>
    <template v-slot:button>
      {{ t("nfv.plugin", [t("Create")]) }}
    </template>
    <template v-slot:table-name>
      {{ t("nfv.plugin", ["NFV MANO", t("list")]) }}
    </template>
    <template v-slot:table-td>
      <tr v-for="item in filterEntries" :key="item.name">
        <td class="tablecell-custom">{{ item.name }}</td>
        <td class="tablecell-custom">{{ item.allocate_nssi }}</td>
        <td class="tablecell-custom">{{ item.deallocate_nssi }}</td>
        <td class="w-0">
          <div
            class="d-flex justify-content-center form-check form-switch mb-0"
          >
            <input
              class="form-check-input cursor-pointer"
              type="checkbox"
              role="switch"
              
              :checked="item.share"
              @click="isPublic(item.name, item.share)"
            />
            <!-- (item.name, item.share) -->
          </div>
        </td>
        <td class="w-0">
          <div
            class="d-flex justify-content-center align-items-center text-white bg-warning rounded-circle cursor-pointer mx-auto"
            style="width: 30px; height: 30px"
            data-bs-toggle="modal"
            data-bs-target="#update_plugin_Modal"
            @click="get_plugin_name(item.name)"
          >
            <i class="bi bi-wrench"></i>
          </div>
        </td>
        <td class="w-0">
          <a
            :href="item.pluginFile"
            @click="download_template_button(item.pluginFile)"
            class="d-flex justify-content-center align-items-center text-white bg-primary rounded-circle cursor-pointer mx-auto"
            style="width: 30px; height: 30px"
          >
            <i class="bi bi-arrow-down"></i>
          </a>
        </td>
        <td class="w-0">
          <div
            class="d-flex justify-content-center align-items-center text-white bg-danger rounded-circle cursor-pointer mx-auto"
            style="width: 30px; height: 30px"
            data-bs-toggle="modal"
            data-bs-target="#delete_plugin_Modal"
            @click="get_plugin_name(item.name)"
          >
            <i class="bi bi-trash"></i>
          </div>
        </td>
      </tr>
    </template>
  </Table>
  <Modalcreate
    ref="modalCreate"
    @remove="removeCreateData"
    @keypress.enter="create_plugin_modal"
  >
    <template v-slot:header>
      {{ t("nfv.create") }}
    </template>
    <template v-slot:body>
      <div>
        <div class="mb-3">
          <label for="InputFile" class="form-label">
            {{ `${t("nfv.name")} :` }}
          </label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': text_invalidated }"
            id="InputFile"
            :placeholder="t('nfv.enter')"
            v-model.trim="fileName"
            autocomplete="off"
          />
          <div class="invalid-feedback">
            <template v-if="repeatName">
              {{ t("exists", [t("nfv.thisName")]) }}
            </template>
            <template v-else>
              {{ t("notEmpty", [t("nfv.name")]) }}
            </template>
          </div>
        </div>
        <div class="mb-2">
          <label for="UploadFileCreate" class="form-label">
            {{ `${t("nfv.file")} :` }}
          </label>
          <input
            type="file"
            class="form-control"
            :class="{ 'is-invalid': file_invalidated }"
            id="UploadFileCreate"
            ref="uploadData_create"
            accept=".zip"
            @change="getFileData"
          />
          <div class="invalid-feedback">
            {{ t("notEmpty", [t("nfv.file")]) }}
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button
        type="button"
        class="btn btn-primary text-white"
        @click="create_plugin_modal"
      >
        {{ t("Create") }}
      </button>
    </template>
  </Modalcreate>
  <Modalupdate
    ref="modalUpdate"
    @remove="removeUpdateData"
    @keypress.enter="update_plugin_modal"
  >
    <template v-slot:header>
      {{ `${t("nfv.plugin", [t("nfv.update")])}` }}
    </template>
    <template v-slot:body>
      <form>
        <div class="mb-3">
          <label for="InputFile" class="form-label">
            {{ `${t("nfv.name")} :` }}
          </label>
          <input
            type="text"
            class="form-control"
            id="InputFile"
            :placeholder="t('nfv.enter')"
            v-model="fileName"
            readonly
          />
        </div>
        <div class="mb-2">
          <label for="UploadFileUpdate" class="form-label">
            {{ `${t("nfv.file")} :` }}
          </label>
          <input
            type="file"
            class="form-control"
            :class="{ 'is-invalid': file_invalidated }"
            id="UploadFileUpdate"
            ref="uploadData_update"
            accept=".zip"
            @change="getFileData"
          />
          <div class="invalid-feedback">
            {{ t("notEmpty", [t("File")]) }}
          </div>
        </div>
      </form>
    </template>
    <template v-slot:footer>
      <button
        type="button"
        class="btn btn-warning text-white"
        @click="update_plugin_modal"
      >
        {{ t("Update") }}
      </button>
    </template>
  </Modalupdate>
  <Modaldelete
    ref="modalDelete"
    @remove="removeDeleteData"
    @keypress.enter="delete_plugin_modal"
    @delete="delete_plugin_modal"
  >
    <template v-slot:header>
      {{ `${t("nfv.plugin", [t("nfv.delete")])}` }}
    </template>
  </Modaldelete>
  <Alert ref="alertRef" v-show="alertExist"></Alert>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { delay } from '@/assets/js/delay';
import { form } from '@/assets/js/newFormData';
import Table from '../components/global/table.vue';
import { alertConfig } from '@/assets/js/alertData';
import { closeModal } from '@/assets/js/closeModel';
import { api } from '../apis/api';
import { ref, toRefs, watch, computed, onBeforeMount, defineAsyncComponent } from 'vue';
import { NFVO_create, NFVO_update, NFVO_delete, callDownload } from '@/assets/js/templateOperate';
import { text_invalidated, file_invalidated, file_Validate, text_Validate } from '@/assets/js/validate';
const Alert = defineAsyncComponent(() => import(/* webpackChunkName: "Alert" */ '../components/global/alert.vue'));
const Modalcreate = defineAsyncComponent(() => import(/* webpackChunkName: "Modalcreate" */ '../components/global/modal-create.vue'));
const Modalupdate = defineAsyncComponent(() => import(/* webpackChunkName: "Modalupdate" */ '../components/global/modal-update.vue'));
const Modaldelete = defineAsyncComponent(() => import(/* webpackChunkName: "Modaldelete" */ '../components/global/modal-delete.vue'));
const modalCreate = ref(null);
const modalUpdate = ref(null);
const modalDelete = ref(null);
const uploadData_create = ref(null);
const uploadData_update = ref(null);
const { t } = useI18n();
const  store  = useStore();
const th_list = [
  { name: "name", text: t('nfv.name') },
  { name: "allocate_nssi", text: t('nfv.allocate') },
  { name: "deallocate_nssi", text: t('nfv.deallocate') },
  { name: "template_share", text: t("public") },
  { name: "update_plugin", text: t("Update") },
  { name: "plugin_file", text: t("Download") },
  { name: "delete_plugin", text: t("Delete") },
];
const td_list = ref([]);
const fileName = ref('');
const fileData = ref({});
const status = ref(false);
const filterEntries = ref([]);
const { alertRef, alertExist } = toRefs(alertConfig);
const columnSort = ['name', 'allocate_nssi', 'deallocate_nssi'];
const repeatName = computed(() => {
  return td_list.value.map(e => { return e.name }).includes(fileName.value);
});
const get_plugin_name = name => { // Update Modal 內名稱
  fileName.value = name;
};
const getFileData = e => { // 更新 Update Modal 內檔案
  fileData.value = e.target.files;
  if(e.target.id == 'UploadFileCreate')
    modalCreate.value.focusModalEvent();
  else
    modalUpdate.value.focusModalEvent();
};
const getTableData = async () => { // 顯示 Table 資料
  const res = await api.tableList().pluginList();
  console.log(res)
  // if(uu_id == "1"){
  //   td_list.value = res.data;
  // }else{
    td_list.value = res.data.filter(x => x.user_id == store.state.uuid );
  // }

  // td_list.value = res.data
};
const create_validate = () => {  // Create Modal 驗證
  const textValidate = text_Validate([repeatName.value, fileName.value]);
  const fileValidate = file_Validate(fileData.value[0]);
  const validate = textValidate && fileValidate;
  return validate;
};
const create_plugin_modal = async () => { // 點擊 Create Modal 內創建按鈕
  const createValidate = create_validate();
  console.log(fileData.value[0])
  if(createValidate) {
    const formData = form(["name", "pluginFile"], [fileName.value, fileData.value[0]]);
    const alertData = {
      Template: t('nfv.plugin', ['NFV MANO']),
      configSuccess: t('created'),
      configUnsuccess: t('create'),
    };
    NFVO_create(formData,getTableData,alertData)
    closeModal(modalCreate.value);
    
  }
};

const update_plugin_validate = () => { // Update Modal 驗證
  const fileValidate = file_Validate(fileData.value[0]);
  return fileValidate;
};
const update_plugin_modal = () => { // 點擊 Update Modal 內更新按鈕
  const updateValidate = update_plugin_validate();
  if(updateValidate) {
    const formData = form(["name", "pluginFile"], [fileName.value, fileData.value[0]]);
    const alertData = {
      Template: t('nfv.plugin', ['NFV MANO']),
      configSuccess: t('updated'),
      configUnsuccess: t('update'),
    };
    NFVO_update([fileName.value, formData], getTableData, alertData);
    closeModal(modalUpdate.value);
  }
};
const delete_plugin_modal = () => { // 點擊 Delete Modal 內刪除按鈕
  const alertData = {
    Template: t('nfv.plugin', ['NFV MANO']),
    configSuccess: t('deleted'),
    configUnsuccess: t('delete'),
  };
  NFVO_delete(fileName.value, getTableData, alertData);
  closeModal(modalDelete.value);
};
const updateTableData = val => {  // 每次執行 Table 操作，更新資料
  filterEntries.value = val;
};
const removeCreateData = () => { // 關閉 Create Modal
  fileName.value = '';
  fileData.value = {};
  text_invalidated.value = false;
  file_invalidated.value = false;
  uploadData_create.value.value = null;
};
const removeUpdateData = () => { // 關閉 Update Modal
  fileName.value = '';
  fileData.value = {};
  file_invalidated.value = false;
  uploadData_update.value.value = null;
};
const removeDeleteData = () => { // 關閉 Delete Modal
  fileName.value = '';
};
const download_template_button = file => { // 點擊 Download Modal 按鈕
  const alertData = {
    Template: t('nfv.plugin', ['NFV MANO']),
    configSuccess: t('downloaded '),
    configUnsuccess: t('download'),
  };
  callDownload(file, alertData);
};
const isPublic = (name, share) => {
  const isShare = !share
  console.log('s',isShare)
  api.nfvManoPlugin().public({
    name:name,
    share:isShare
  })
.then(res=>{
    console.log(res)
    getTableData()
  }).catch((err)=>{
    console.log(err)
  })

}
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
