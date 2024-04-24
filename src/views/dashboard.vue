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
      <button class="btn btn-primary ms-3 text-white" @click="cbtn('NFVO')">
        <span class="d-none d-sm-inline"> NFVO </span>
      </button>
      <button class="btn btn-primary ms-2 text-white" @click="cbtn('VNF')">
        <span class="d-none d-sm-inline"> VNF </span>
      </button>
      <button class="btn btn-primary ms-2 text-white" @click="cbtn('NSD')">
        <span class="d-none d-sm-inline"> NSD </span>
      </button>
      <button class="btn btn-primary ms-2 text-white" @click="cbtn('NRM')">
        <span class="d-none d-sm-inline"> NRM </span>
      </button>
    </template>
    <template v-slot:table-name>
      {{ name }}
    </template>
    <template v-slot:table-td>
      <tr v-for="item in filterEntries" :key="item.name">
        <td v-for="i in trHeader" :key="i" class="tablecell-custom">
          <i
            v-if="i == 'templateId'"
            class="bi bi-list cursor-pointer me-1"
            data-bs-toggle="modal"
            data-bs-target="#show_plugin_Modal"
            @click="get_templateId(item[i])"
          ></i>
          {{ item[i] }}
        </td>
      </tr>
    </template>
  </Table>
  <Modalshow ref="modalShow" @remove="removeShowData">
    <template v-slot:header> {{ templateName }} {{ t("list") }} </template>
    <template v-slot:body>
      <form>
        <div class="mb-3">
          <label for="InputFile" class="form-label">
            {{ `${t("generic.template", [templateName, t("ID")])} :` }}
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
      </form>
    </template>
  </Modalshow>
</template>
<script setup>
import { useI18n } from "vue-i18n";
import { delay } from "@/assets/js/delay";
import Table from "../components/global/table.vue";
import { api } from "../apis/api";
import { ref, onBeforeMount, onMounted, defineAsyncComponent } from "vue";
const Modalshow = defineAsyncComponent(() =>
  import(
    /* webpackChunkName: "Modalshow" */ "../components/global/modal-show.vue"
  )
);
const { t } = useI18n();
const showBtn = ref(false);
const th_list = ref([
  { name: "userName", text: t("base.userName") },
  { name: "name", text: t("nfv.name") },
  { name: "allocate_nssi", text: t("nfv.allocate") },
  { name: "deallocate_nssi", text: t("nfv.deallocate") },
]);
const td_list = ref([]);
const templateId = ref("");
const templateName = ref("");
const status = ref(false);
const filterEntries = ref([]);
const columnSort = ref([
  "userName",
  "name",
  "allocate_nssi",
  "deallocate_nssi",
]);
const trHeader = ref(["user_name", "name", "allocate_nssi", "deallocate_nssi"]);
const getNfvoList = async () => {
  const res = await api.tableList().pluginList();
  td_list.value = res.data;
};
const getgenericList = async () => {
  const res = await api.tableList().templateList();
  td_list.value = res.data.filter(
    (x) => (x.templateType == templateName.value && x.operationStatus == "UPLOAD")
  );
};
const updateTableData = (val) => {
  // 每次執行 Table 操作，更新資料
  filterEntries.value = val;
};
const name = ref(t("nfv.plugin", ["NFV MANO", t("list")]));
const cbtn = (val) => {
  if (val === "NFVO") {
    name.value = t("nfv.plugin", ["NFV MANO", t("list")]);
    th_list.value = [
      { name: "userName", text: t("base.userName") },
      { name: "name", text: t("nfv.name") },
      { name: "allocate_nssi", text: t("nfv.allocate") },
      { name: "deallocate_nssi", text: t("nfv.deallocate") },
    ];
    columnSort.value = ["userName", "name", "allocate_nssi", "deallocate_nssi"];
    trHeader.value = ["user_name", "name", "allocate_nssi", "deallocate_nssi"];
    getNfvoList();
  } else {
    templateName.value = val;
    name.value = t("generic.template", [val, t("list")]);
    filterGBtn();
  }
};
const filterGBtn = async () => {
  th_list.value = [
    { name: "userName", text: t("base.userName") },
    { name: "templateId", text: t("ID") },
    { name: "name", text: t("generic.name") },
    { name: "description", text: t("Description") },
    { name: "templateType", text: t("Type") },
    { name: "nfvoType", text: t("NFVO") },
  ];
  columnSort.value = [
    "userName",
    "templateId",
    "name",
    "nfvoType",
    "deallocate_nssi",
  ];
  trHeader.value = [
    "user_name",
    "templateId",
    "name",
    "description",
    "nfvoType",
    "templateType",
  ];
  getgenericList();
};
const get_templateId = (id) => {
  templateId.value = id;
};
const removeShowData = () => {
  // 關閉 Show Modal
  templateId.value = "";
};
onBeforeMount(async () => {
  try {
    await getNfvoList();
    await delay(700);
    status.value = true;
  } catch (err) {
    console.log(err);
  }
});
onMounted(() => {});
</script>
