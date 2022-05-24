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
        {{ t("generic.template", [t("template_header", 0)]) }}
      </h3>
    </template>
    <template v-slot:button>
      {{ t("generic.template", [`${t("Create")}VNF`]) }}
    </template>
    <template v-slot:table-name>
      {{ t("generic.template", ["VNF", t("list")]) }}
    </template>
    <template v-slot:table-td>
      <tr v-for="item in filterEntries" :key="item.templateId">
        <td class="tablecell-custom">
          <i
            class="bi bi-list cursor-pointer me-1"
            data-bs-toggle="modal"
            data-bs-target="#show_plugin_Modal"
            @click="show_template_button(item.templateId, item.content)"
          ></i>
          {{ item.templateId }}
        </td>
        <td class="tablecell-custom">{{ item.name }}</td>
        <td class="tablecell-custom">{{ item.description }}</td>
        <td class="tablecell-custom">{{ item.templateType }}</td>
        <td class="tablecell-custom">{{ item.nfvoType }}</td>
        <td class="tablecell-custom">{{ item.operationStatus }}</td>
        <td class="w-0">
          <div
            class="d-flex justify-content-center form-check form-switch mb-0"
          >
            <input
              class="form-check-input cursor-pointer"
              type="checkbox"
              role="switch"
             :disabled="item.operationStatus == 'CREATED'"
              :checked="item.share"
              @click="isPublic(item.name, item.share)"
            />
          </div>
        </td>
        <td class="w-0">
          <div
            class="d-flex justify-content-center align-items-center text-white bg-warning rounded-circle cursor-pointer mx-auto"
            style="width: 30px; height: 30px"
            data-bs-toggle="modal"
            data-bs-target="#update_plugin_Modal"
            @click="update_template_button(item.templateId, item.nfvoType)"
          >
            <i class="bi bi-wrench"></i>
          </div>
        </td>
        <td class="w-0">
          <a
            :href="item.templateFile"
            @click="download_template_button(item.templateFile)"
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
            @click="get_templateId(item.templateId)"
          >
            <i class="bi bi-trash"></i>
          </div>
        </td>
      </tr>
    </template>
  </Table>
  <Modalshow ref="modalShow" @remove="removeShowData">
    <template v-slot:header> VNF {{ t("list") }} </template>
    <template v-slot:body>
      <form>
        <div class="mb-3">
          <label for="InputFile" class="form-label">
            {{ `${t("generic.template", ["VNF", t("ID")])} :` }}
          </label>
          <input
            type="text"
            class="form-control"
            id="InputFile"
            placeholder="請輸入 Plugin 名稱"
            v-model="templateId"
            readonly
          />
        </div>
        <div>
          <label for="VnfList" class="form-label">
            VNF {{ t("ID") }}{{ t("list") }} :
          </label>
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item"
              v-for="item in templateVNFList[templateId]"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </form>
    </template>
  </Modalshow>
  <Modalcreate
    ref="modalCreate"
    @remove="removeCreateData"
    @keypress.enter="create_template_modal"
  >
    <template v-slot:header>
      {{ t("generic.create", ["VNF"]) }}
    </template>
    <template v-slot:body>
      <form>
        <div class="mb-3">
          <label for="InputFile" class="form-label">
            {{ `${t("generic.name")} :` }}
          </label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': text_invalidated }"
            id="InputFile"
            :placeholder="t('generic.name')"
            v-model.trim="templateName"
            autocomplete="off"
          />
          <div class="invalid-feedback">
            <template v-if="repeatName">
              {{ t("exists", [t("generic.thisName")]) }}
            </template>
            <template v-else>
              {{ t("notEmpty", [t("generic.name")]) }}
            </template>
          </div>
        </div>
        <div class="mb-3">
          <label for="InputFile2" class="form-label">
            {{ `${t("generic.description", ["VNF"])} :` }}
          </label>
          <input
            type="text"
            class="form-control"
            id="InputFile2"
            :placeholder="t('Description')"
            v-model.trim="templateDescription"
            autocomplete="off"
          />
        </div>
        <div class="mb-2">
          <label for="InputFile3" class="form-label">
            {{ `${t("generic.NFVOName")} :` }}
          </label>
          <select
            v-model="currentNFVMANO"
            class="form-select form-select"
            :class="{ 'is-invalid': select_invalidated }"
            id="InputFile3"
            aria-label=".form-select"
            @change="selectNFVMANO"
          >
            <option selected disabled :value="t('base.select')">
              {{ t("base.select") }}
            </option>
            <option
              v-for="item in sortNFVMANOList"
              :key="item.name"
              :value="item.name"
            >
              {{ item.name }}
            </option>
          </select>
          <div class="invalid-feedback">
            {{ t("selectTemplate", ["NFVO", t("plugin")]) }}
          </div>
        </div>
      </form>
    </template>
    <template v-slot:footer>
      <button
        type="button"
        class="btn btn-primary text-white"
        @click="create_template_modal"
      >
        {{ t("Create") }}
      </button>
    </template>
  </Modalcreate>
  <Modalupdate
    ref="modalUpdate"
    @remove="removeUpdateData"
    @keypress.enter="update_template_modal"
  >
    <template v-slot:header>
      {{ t("generic.update", ["VNF"]) }}
    </template>
    <template v-slot:body>
      <form>
        <div class="mb-3">
          <label for="InputFile" class="form-label">
            {{ `${t("generic.template", ["VNF", t("ID")])} :` }}
          </label>
          <input
            type="text"
            class="form-control"
            id="InputFile"
            v-model="templateId"
            readonly
          />
        </div>
        <div class="mb-2">
          <label for="UploadFile2" class="form-label">
            {{ `${t("generic.template", ["VNF", t("File")])} :` }}
          </label>
          <input
            type="file"
            class="form-control"
            :class="{ 'is-invalid': file_invalidated }"
            id="UploadFile2"
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
        @click="update_template_modal"
      >
        {{ `${t("Update")}` }}
      </button>
    </template>
  </Modalupdate>
  <Modaldelete
    ref="modalDelete"
    @remove="removeDeleteData"
    @keypress.enter="delete_template_modal"
    @delete="delete_template_modal"
  >
    <template v-slot:header>
      {{ t("generic.delete", ["VNF"]) }}
    </template>
  </Modaldelete>
  <Alert ref="alertRef" v-show="alertExist"></Alert>
</template>
<script setup>
import { $array } from 'alga-js';
import { api } from '../apis/api';
import { useI18n } from 'vue-i18n';
import { delay } from '@/assets/js/delay';
import { form } from '@/assets/js/newFormData';
import Table from '../components/global/table.vue';
import { closeModal } from '@/assets/js/closeModel';
import { alertConfig } from '@/assets/js/alertData';
import { computed, onBeforeMount, ref, watch, toRefs, defineAsyncComponent } from 'vue';
import { generic_create, generic_update, generic_delete, callDownload } from '@/assets/js/templateOperate';
import { text_invalidated, file_invalidated, select_invalidated, file_Validate, text_Validate, select_Validate } from '@/assets/js/validate';
const { t } = useI18n();
const { alertRef, alertExist } = toRefs(alertConfig);
const Alert = defineAsyncComponent(() => import(/* webpackChunkName: "Alert" */ '../components/global/alert.vue'));
const Modalshow = defineAsyncComponent(() => import(/* webpackChunkName: "Modalshow" */ '../components/global/modal-show.vue'));
const Modalcreate = defineAsyncComponent(() => import(/* webpackChunkName: "Modalcreate" */ '../components/global/modal-create.vue'));
const Modalupdate = defineAsyncComponent(() => import(/* webpackChunkName: "Modalupdate" */ '../components/global/modal-update.vue'));
const Modaldelete = defineAsyncComponent(() => import(/* webpackChunkName: "Modaldelete" */ '../components/global/modal-delete.vue'));
const modalCreate = ref(null);
const modalUpdate = ref(null);
const modalDelete = ref(null);
const uploadData_update = ref(null);
const status = ref(false);
const th_list = [
  { name: "templateId", text: t("ID") },
  { name: "name", text: t('generic.name') },
  { name: "description", text: t("Description") },
  { name: "templateType", text: t('Type') },
  { name: "nfvoType", text: t("NFVO") },
  { name: "operationStatus", text: t('generic.status', ['VNF']) },
  { name: "template_share", text: t('public') },
  { name: "update_template", text: t("Update") },
  { name: "template_Download", text: t("Download") },
  { name: "delete_template", text: t("Delete") },
]
const td_list =  ref([]);
const fileData = ref({});
const templateId = ref('');
const templateName = ref('');
const filterEntries = ref([]);
const nfv_mano_list =  ref([]);
const templateVNFList = ref({});
const templateDescription = ref('');
const currentNFVMANO = ref(t('base.select'));
const columnSort = ['templateId', 'name', 'description', 'templateType', 'nfvoType', 'operationStatus'];
const repeatName = computed(() => {
  return td_list.value.map(e => e.name).includes(templateName.value);
});
const sortNFVMANOList = computed(() => {
  return $array.sortBy(nfv_mano_list.value, 'name', 'asc');
});
const selectNFVMANO = () => {
  modalCreate.value.focusModalEvent();
};
const getPluginList = async () => {  // 顯示 Table 資料
  const res = await api.tableList().pluginList();
  nfv_mano_list.value = res.data;
};
const getTableData = async () => {  // 顯示 Table 資料
  const res = await api.tableList().templateList();
  console.log(res)
  // const VNFfilter = res.data.filter(x => x.templateType == 'VNF');
  // td_list.value = VNFfilter.filter(x => x.user_id == '7');
  td_list.value = res.data.filter(x => x.templateType == 'VNF');

};
const create_Validate = () => {
  const set = t('base.select');
  const textValidate = text_Validate([repeatName.value, templateName.value]);
  const selectValidate = select_Validate(currentNFVMANO.value, set);
  const validate = textValidate && selectValidate;
  return validate;
};
const create_template_modal = () => { // 點擊 Create Modal 內創建按鈕
  const createValidate = create_Validate();
  if(createValidate) {
    const alertData = {
      Template: t('generic.template', [t('template_header', 0)]),
      configSuccess:  t('created'),
      configUnsuccess:  t('create'),
    };
    const formName = ['name', 'description', 'nfvoType', 'templateType'];
    const formValue = [templateName.value, templateDescription.value, currentNFVMANO.value, 'VNF'];
    const formData = form(formName, formValue);
    generic_create(formData, getTableData, alertData);
    closeModal(modalCreate.value);
  }
};
const get_templateId = id => {
  templateId.value = id;
};
const getFileData = e => {
  fileData.value = e.target.files;
  modalUpdate.value.focusModalEvent();
};
const update_template_validate = () => {
  const fileValidate = file_Validate(fileData.value[0]);
  return fileValidate;
};
const update_template_button = (id, type) => { // 點擊 Update Modal 按鈕
  get_templateId(id);
  currentNFVMANO.value = type;
};
const update_template_modal = async () => { // 點擊 Update Modal 內更新按鈕
  const updateValidate = update_template_validate();
  if(updateValidate) {
    const alertData = {
      Template: t('generic.template', [t('template_header', 0)]),
      configSuccess: t('updated'),
      configUnsuccess: t('update'),
    };
    const formName = ['name', 'templateType', 'templateFile'];
    const formValue = [currentNFVMANO.value, 'VNF', fileData.value[0]];
    const formData = form(formName, formValue);
    generic_update([templateId.value, formData], getTableData, alertData);
    closeModal(modalUpdate.value);
  }
};
const delete_template_modal = () => { // 點擊 Delete Modal 內刪除按鈕
  const alertData = {
    Template: t('generic.template', [t('template_header', 0)]),
    configSuccess: t('deleted'),
    configUnsuccess: t('delete'),
  };
  generic_delete(templateId.value, getTableData, alertData);
  closeModal(modalDelete.value);
};
const updateTableData = val => {  // 每次執行 Table 操作，更新資料
  filterEntries.value = val;
};
const download_template_button = file => { // 點擊 Download Modal 按鈕
  const alertData = {
    Template: t('generic.template', [t('template_header', 0)]),
    configSuccess: t('downloaded'),
    configUnsuccess: t('download'),
  };
  callDownload(file, alertData);
};
const show_template_button = (id, content) => { // 點擊 Show Modal 按鈕
  templateId.value = id;
  const map = new Map();
  map.set(id, content);
  for(const value of map) {
    templateVNFList.value[value[0]] = [];
    if(value[1].length == 0) {
      const str = `${t('generic.templateNotFound', [t('template_header', 0)])} !!`;
      templateVNFList.value[value[0]].push(str);
    }
    for(const item of value[1]) {
      let tojson = JSON.parse(item.topology_template.replace(/'/g, '"').replace(/:[ ]*False/, ":false").replace(/:[ ]*True/, ":true"));
      templateVNFList.value[value[0]].push(tojson.node_templates.VNF1.properties.descriptor_id);
    }
  }
};
const removeShowData = () => { // 關閉 Show Modal
  templateId.value = '';
  templateVNFList.value = {};
};
const removeCreateData = () =>  { // 關閉 Create Modal
  templateName.value = '';
  templateDescription.value = '';
  currentNFVMANO.value = t('base.select');
  text_invalidated.value = false;
  select_invalidated.value = false;
};
const removeUpdateData = () => { // 關閉 Update Modal
  templateId.value = '';
  fileData.value = {};
  currentNFVMANO.value = t('base.select');
  file_invalidated.value = false;
  uploadData_update.value.value = null;
};
const removeDeleteData = () =>  { // 關閉 Delete Modal
  templateId.value = '';
};
const isPublic = (name, share) => {
  const isShare = !share
  api.genericTemplate().public({
    type:'NRM',
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
watch(templateName, () => { text_invalidated.value = false; });
watch(fileData, () => { file_invalidated.value = false; });
watch(currentNFVMANO, () => { select_invalidated.value = false; });

onBeforeMount(async () => {
 try {
   await getTableData();
   await getPluginList();
 }
 catch(err) {
   console.log(err);
 }
 await delay(700);
 status.value = true;
});
</script>
