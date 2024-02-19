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
        Firewall
      </h3>
    </template>
    <template v-slot:button>
      Create Blocked Rule
    </template>
    <template v-slot:table-name>
      Blocked IP list
    </template>
    <template v-slot:table-td>
      <tr v-for="item in filterEntries" :key="item.templateId">
        <td class="tablecell-custom">{{ item.chain }}</td>
        <td class="tablecell-custom">{{ item.target }}</td>
        <td class="tablecell-custom">{{ item.source }}</td>
        <td class="tablecell-custom">{{ item.destination }}</td>
        <td class="tablecell-custom">{{ item.protocol }}</td>
        <td class="tablecell-custom">{{ item.pkts }}</td>
        <td class="tablecell-custom">{{ item.bytes }}</td>
        <td class="tablecell-custom">{{ item.rule_id }}</td>
        <td class="w-0">
          <div class="d-flex justify-content-center align-items-center text-white cursor-pointer mx-auto" style="width:30px; height:30px" @click="delete_rule(item.chain, item.rule_id)">
            <img src="../assets/delete.png"  style="width:30px; height:30px" alt="">
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
      {{ "Enter the IP to be blocked" }}
    </template>
    <template v-slot:body>
      <form>
        <div class="mb-3">
          <label for="InputFile2" class="form-label">
            {{ "Destination IP" }}
          </label>
          <input
            type="text"
            class="form-control"
            id="InputFile2"
            v-model.trim="templateDescription"
            autocomplete="off"
          />
        </div>
      </form>
    </template>
    <template v-slot:footer>
      <button
        type="button"
        class="btn btn-primary text-white"
        @click="add_rule()"
      >
        {{ t("Create") }}
      </button>
    </template>
  </Modalcreate>
  <Alert ref="alertRef" v-show="alertExist"></Alert>
</template>
<script setup>
import { api } from '../apis/api';
import { useI18n } from 'vue-i18n';
import { delay } from '@/assets/js/delay';
import { form } from '@/assets/js/newFormData';
import Table from '../components/global/table.vue';
import { closeModal } from '@/assets/js/closeModel';
import { alertConfig } from '@/assets/js/alertData';
import { computed, onBeforeMount, ref, watch, toRefs, defineAsyncComponent } from 'vue';
import { generic_create } from '@/assets/js/templateOperate';
import { text_invalidated, file_invalidated, select_invalidated, text_Validate, select_Validate } from '@/assets/js/validate';
const { t } = useI18n();
const { alertRef, alertExist } = toRefs(alertConfig);
const Alert = defineAsyncComponent(() => import(/* webpackChunkName: "Alert" */ '../components/global/alert.vue'));
const Modalshow = defineAsyncComponent(() => import(/* webpackChunkName: "Modalshow" */ '../components/global/modal-show.vue'));
const Modalcreate = defineAsyncComponent(() => import(/* webpackChunkName: "Modalcreate" */ '../components/global/modal-create.vue'));
const modalCreate = ref(null);
const status = ref(false);
const th_list = [
  { name: "chain", text: `Chain` },
  { name: "target", text: `Target` },
  { name: "source", text: `Source IP` },
  { name: "destination", text: `Destination IP` },
  { name: "protocol", text: `Protocol` },
  { name: "pkts", text: `Packets` },
  { name: "bytes", text: `Bytes` },
  { name: "rule_id", text: `Rule_id` },
  { name: "Delete", text: `Delete` },
];
const td_list =  ref([]);
const fileData = ref({});
const templateId = ref('');
const templateName = ref('');
const filterEntries = ref([]);
const templateVNFList = ref({});
const templateDescription = ref('');
const currentNFVMANO = ref(t('base.select'));
const columnSort = ['chain', 'target', 'source', 'destination', 'protocol', 'pkts', 'bytes', 'rule_id','Delete'];
const repeatName = computed(() => {
  return td_list.value.map(e => e.name).includes(templateName.value);
});
const getTableData = async () => {  // 顯示 Table 資料
  const res = await api.tableList().IPList();
  td_list.value = res.data.fin_data;
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

const updateTableData = val => {  // 每次執行 Table 操作，更新資料
  filterEntries.value = val;
};
const removeShowData = () => { // 關閉 Show Modal
  templateId.value = '';
  templateVNFList.value = {};
};
const removeCreateData = () =>  { // 關閉 Create Modal
  console.log("removeCreateData")
  templateName.value = '';
  templateDescription.value = '';
  currentNFVMANO.value = t('base.select');
  text_invalidated.value = false;
  select_invalidated.value = false;
};
const delete_rule = async (chain, rule_id) => { // Update Modal 內名稱
  console.log(chain)
  console.log(rule_id)
  const combined_id = `${chain}-${rule_id}`;
  api.nsSecurity().deleteRule(combined_id);
  await delay(1000);
  await getTableData();
  // fileName.value = name;
};
const add_rule = async ()  => { // Update Modal 內名稱
  console.log("add_rule")
  console.log(templateDescription.value)
  api.nsSecurity().addRule(templateDescription.value);
  console.log("12333", api.nsSecurity());
  await delay(700);
  await getTableData();
  // fileName.value = name;
};
watch(templateName, () => { text_invalidated.value = false; });
watch(fileData, () => { file_invalidated.value = false; });
watch(currentNFVMANO, () => { select_invalidated.value = false; });

onBeforeMount(async () => {
 try {
   await getTableData();
  //  await getPluginList();
 }
 catch(err) {
   console.log(err);
 }
 await delay(700);
 status.value = true;
});
</script>
