<template>
  <div class="d-flex flex-column p-4 user-select-none">
    <template v-if="pageStatus">
      <div
        class="container-header d-flex justify-content-start align-items-center mb-4"
      >
        <slot name="header"></slot>
        <button
          v-if="showBtn"
          class="btn btn-primary ms-3 text-white"
          data-bs-toggle="modal"
          data-bs-target="#create_plugin_Modal"
        >
          <i class="d-sm-none bi bi-folder-plus"></i>
          <span class="d-none d-sm-inline">
            <slot name="button"></slot>
          </span>
        </button>
      </div>
      <div class="card shadow-sm">
        <div class="card-header card-header-custom py-3">
          <h6>
            <slot name="table-name"></slot>
          </h6>
        </div>
        <div class="d-flex flex-column card-body">
          <div class="d-flex mb-3 align-items-center">
            <div class="d-flex align-items-baseline me-2">
              {{ t(`show`) }}
              <select
                v-model="currentEntries"
                class="form-select form-select-sm form-select-custom mx-2"
                @change="paginateEntries"
              >
                <option
                  v-for="option in showEntries"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
              {{ t(`entries`) }}
            </div>
            <div class="d-flex ms-auto">
              <input
                type="text"
                class="form-control form-control"
                :placeholder="Search"
                v-model.trim="searchInput"
                @input="searchEvent"
              />
            </div>
          </div>
          <div class="mb-2 mb-lg-3 table-custom" style="min-height: 115px">
            <table
              class="table table-bordered table-striped table-hover align-middle mb-0"
            >
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="table-light cursor-pointer col-1"
                    :class="{ 'w-0': !sortableColumn(item.name) }"
                    v-for="item in columns"
                    :key="item.name"
                    @click="sortColumn(item.name)"
                  >
                    <template v-if="sortableColumn(item.name)">
                      <div class="d-flex justify-content-between">
                        <span>{{ item.text }}</span>
                        <i
                          :class="[
                            [
                              item.name == this.sortDesc
                                ? 'bi bi-sort-alpha-up'
                                : 'bi bi-sort-alpha-down',
                            ],
                            {
                              'text-danger':
                                item.name == this.sortAsc ||
                                item.name == this.sortDesc,
                            },
                            'ms-2',
                          ]"
                        ></i>
                      </div>
                    </template>
                    <template v-else>
                      <div>{{ item.text }}</div>
                    </template>
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-if="loadingStatus">
                  <tr class="text-center">
                    <td :colspan="columnNumber">
                      <div
                        class="d-flex justify-content-center align-items-center"
                      >
                        <span
                          class="spinner-grow spinner-grow-sm"
                          role="status"
                        >
                          <span class="visually-hidden"
                            >{{ t("Loading") }}...</span
                          >
                        </span>
                        <strong class="ms-3">{{ t("Loading") }}...</strong>
                      </div>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <template v-if="filterEntries.length > 0">
                    <slot name="table-td"></slot>
                  </template>
                  <template v-else>
                    <tr class="text-center">
                      <td :colspan="columnNumber">
                        {{ t("matchingnotFound") }}
                      </td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </table>
          </div>
          <div
            class="d-flex flex-wrap justify-content-center justify-content-lg-between align-items-center"
          >
            <div class="col-12 text-center col-lg-auto mb-2 mb-lg-0">
              {{
                t("base.showEntries", [
                  showInfo.start,
                  showInfo.end,
                  showInfo.length,
                ])
              }}
            </div>
            <ul
              class="pagination justify-content-center flex-wrap col-lg-auto"
              :class="{ 'pagination-sm': currentWindowWidth < 576 }"
            >
              <li class="page-item" :class="{ disabled: currentPage == 1 }">
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="paginateEvent(1)"
                  >{{ t("first") }}</a
                >
              </li>
              <li class="page-item" :class="{ disabled: currentPage == 1 }">
                <a
                  class="page-link"
                  href="#"
                  @click="paginateEvent(currentPage - 1)"
                  ><i class="bi bi-chevron-left"></i
                ></a>
              </li>
              <li
                class="page-item"
                v-for="page in showPagination"
                :key="page"
                :class="[{ active: page == currentPage }]"
                :data-bs-toggle="[page == '...' ? 'modal' : '']"
                data-bs-target="#change_page_Modal"
              >
                <a class="page-link" href="#" @click="paginateEvent(page)">{{
                  page
                }}</a>
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage == allPages }"
              >
                <a
                  class="page-link"
                  href="#"
                  @click="paginateEvent(currentPage + 1)"
                  ><i class="bi bi-chevron-right"></i
                ></a>
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage == allPages }"
              >
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="paginateEvent(allPages)"
                  >{{ t("last") }}</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="placeholder-glow d-flex justify-content-between mt-2 mb-4">
        <div
          class="placeholder placeholder-lg rounded-pill col-6 col-lg-3 col-xxl-2"
        ></div>
        <div
          v-if="showBtn"
          class="placeholder placeholder-lg rounded-pill col-2 col-sm-3 col-lg-1"
        ></div>
      </div>
      <div>
        <div class="card shadow-sm placeholder-glow">
          <div class="card-header card-header-custom py-3">
            <h6 class="placeholder bg-dark rounded-pill col-2 col-lg-1"></h6>
          </div>
          <div class="d-flex flex-column card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div
                class="placeholder placeholder rounded-pill col-3 col-lg-2 col-xl-1"
              ></div>
              <div
                class="placeholder placeholder rounded-pill col-2 col-lg-2 col-xl-1"
              ></div>
            </div>
            <div class="mb-3 mb-lg-3">
              <table
                class="table table-bordered table-striped table-hover align-middle mb-0"
              >
                <thead>
                  <tr>
                    <th v-for="i in 7" :key="i">
                      <div
                        class="d-flex mx-auto placeholder rounded-pill col-12 col-md-10 col-xl-7"
                      ></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="i in 7" :key="i" class="placeholder-glow">
                    <td v-for="i in 7" :key="i">
                      <div
                        class="d-flex mx-auto placeholder rounded-pill col-12 col-md-10 col-xl-7"
                      ></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              class="d-flex flex-wrap justify-content-center justify-content-lg-between align-items-center"
            >
              <div
                class="d-flex col-12 col-lg-2 col-xl-1 justify-content-center mb-3 mb-lg-0"
              >
                <div class="placeholder rounded-pill col-5 col-lg-12"></div>
              </div>
              <div
                class="d-flex col-12 col-lg-3 col-xl-2 justify-content-center justify-content-lg-end"
              >
                <div
                  v-for="i in 5"
                  :key="i"
                  class="placeholder rounded-pill col-1 col-lg mx-1"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <Modalpage :allPages="allPages" @switch="switchPage"></Modalpage>
  </div>
</template>
<script setup>
import { useStore } from "vuex";
import { $array } from "alga-js";
import { useI18n } from "vue-i18n";
import { delay } from "@/assets/js/delay";
import {
  ref,
  toRefs,
  watch,
  computed,
  defineEmits,
  defineProps,
  defineAsyncComponent,
} from "vue";
const Modalpage = defineAsyncComponent(() =>
  import(/* webpackChunkName: "Modalcreate" */ "./modal-page.vue")
);
const emit = defineEmits(["update"]);
const props = defineProps({
  showBtn: {
    typeof: Boolean,
    default: true,
  },
  column: {
    typeof: Array,
  },
  entrie: {
    typeof: Array,
    default: [],
  },
  columnSort: {
    typeof: Array,
  },
  status: {
    typeof: Boolean,
    default: false,
  },
});
const { showBtn, column, entrie, columnSort, status } = toRefs(props);
const { t } = useI18n();
let Search = t("Search");
const store = useStore();
const sortAsc = ref(""); // 當前 ASC 排序 , 若空值則無
const sortDesc = ref(""); // 當前 DESC 排序 , 若空值則無
const searchInput = ref(""); // 當前搜尋
const currentPage = ref(1); // 當前頁數
const currentEntries = ref(10); // 當前每頁筆數
const showEntries = [10, 50, 100]; // 每頁筆數列表
const loadingStatus = ref(false); // 表格載入中的狀態
const entries = ref(entrie.value); // 頁面 td 資料
const columns = computed(() => column.value); // 頁面 tr 資料
const columnNumber = computed(() => column.value.length); // 頁面 tr 個數
const pageStatus = computed(() => {
  return status.value;
}); // 頁面初始載入狀態
const currentWindowWidth = computed(() => {
  return store.state.windowWidth;
}); // 當前視窗寬度
const showPagination = computed(() => {
  return $array.pagination(allPages.value, currentPage.value, 2);
}); // 右下角頁數資訊
const showInfo = computed(() => {
  return $array.pageInfo(
    entries.value,
    currentPage.value,
    currentEntries.value
  );
}); // 左下角筆數資訊
const filterEntries = computed(() => {
  // 當前頁數顯示的資料
  loadingEvent();
  return $array.paginate(
    entries.value,
    currentPage.value,
    currentEntries.value
  );
});
const allPages = computed(() => {
  // 所有頁數 (隨搜尋結果變動)
  if (entries.value.length != 0)
    return $array.pages(entries.value, currentEntries.value);
  else return 1;
});
const loadingEvent = async () => {
  // 表格 loading 效果
  loadingStatus.value = true;
  await delay(500);
  loadingStatus.value = false;
};
const paginateEntries = () => {
  // 換筆數事件
  currentPage.value = 1;
};
const paginateEvent = (page) => {
  // 換頁事件
  if (page != "...") currentPage.value = page;
};
const switchPage = (val) => {
  // Modal 換頁事件
  currentPage.value = val;
};
const searchEvent = () => {
  // 搜尋事件
  currentPage.value = 1;
  entries.value = $array.searchBy(
    entrie.value,
    [searchInput.value],
    columnSort.value
  );
  if (sortAsc.value != "")
    entries.value = $array.sortBy(entries.value, sortAsc.value, "asc");
  if (sortDesc.value != "")
    entries.value = $array.sortBy(entries.value, sortDesc.value, "desc");
};
const sortableColumn = (name) => {
  // 判斷各個 TH 是否能做排序
  return columnSort.value.includes(name);
};
const sortColumn = (name) => {
  // 排序事件
  if (sortableColumn(name)) {
    if (sortAsc.value == name) {
      entries.value = $array.sortBy(entries.value, name, "desc");
      sortAsc.value = "";
      sortDesc.value = name;
    } else {
      entries.value = $array.sortBy(entries.value, name, "asc");
      sortAsc.value = name;
      sortDesc.value = "";
    }
  }
};

watch(
  entrie,
  (newVal) => {
    searchInput.value = "";
    entries.value = newVal;
    entries.value = $array.searchBy(
      entries.value,
      [searchInput.value],
      columnSort.value
    );
    if (sortAsc.value != "")
      entries.value = $array.sortBy(entries.value, sortAsc.value, "asc");
    if (sortDesc.value != "")
      entries.value = $array.sortBy(entries.value, sortDesc.value, "desc");
  },
  {
    deep: true,
  }
);
watch(
  filterEntries,
  (newVal) => {
    if (newVal.length == 0 && currentPage.value != 1) currentPage.value -= 1;
    emit("update", newVal);
  },
  {
    deep: true,
  }
);
</script>
<style>
.container-header h3 {
  margin: 0;
  flex: 1;
  font-size: 1.25rem;
}
.container-header button {
  flex: none;
}

.card-header-custom {
  display: flex;
  align-items: center;
  background-color: #f8f9fc;
}
.card-header h6 {
  margin: 0;
  color: #4e73df;
  font-size: 1rem;
  font-weight: 900;
}
.form-select-custom {
  width: auto !important;
  padding-left: 0.75rem !important;
}
thead tr th {
  height: 48px;
  white-space: nowrap;
  vertical-align: middle;
  position: sticky;
  top: 0;
}
tbody {
  border-top: 0 !important;
}
tbody tr td {
  height: 48px;
}
.table-custom {
  max-height: calc(100vh - 399px);
  overflow-x: scroll !important;
  overflow-y: scroll;
  border-top: 0.1px solid #dee2e6;
}
@media (min-width: 576px) {
  .container-header h3 {
    margin: 0;
    font-size: 1.375rem;
  }
}
@media (min-width: 768px) {
  .container-header h3 {
    margin: 0;
    font-size: 1.625rem;
  }
}
@media (min-width: 992px) {
  .table-custom {
    max-height: calc(100vh - 375px);
  }
}
</style>
