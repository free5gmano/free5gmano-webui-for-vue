<template>
  <Table :column="th_list" :entrie="td_list" :columnSort="columnSort" :status="status" :showBtn="false" @update="updateTableData">
    <template v-slot:header>
      <h3>GNB Instance</h3>
    </template>
    <template v-slot:table-name>
      GNB {{ t('list') }}
    </template>
    <template v-slot:table-td>
      <tr v-for="item in filterEntries" :key="item.gnbId">
        <td class="tablecell-custom">
          <i class="bi bi-list cursor-pointer me-1"></i>
          {{ item.gnbId }}
        </td>
        <td class="tablecell-custom">{{ item.gnbInstanceName }}</td>
        <td class="tablecell-custom">{{ item.administrativeState }}</td>
        <td class="tablecell-custom">{{ item.operationalState }}</td>
        <td class="w-0">
          <div class="d-flex justify-content-center align-items-center text-white cursor-pointer mx-auto" style="width:30px; height:30px">
            <img src="../assets/topology_icon.png" style="width:30px; height:30px" alt="">
          </div>
        </td>
        <td class="w-0">
          <div class="d-flex justify-content-center align-items-center text-white cursor-pointer mx-auto bg-warning rounded-circle" style="width:30px; height:30px" data-bs-toggle="modal" data-bs-target="#GNB_Deallocate_Modal" @click="prepare_terminate(item)">
            <i class="bi bi-exclamation-triangle"></i>
          </div>
        </td>
        <td class="w-0">
          <div class="d-flex justify-content-center align-items-center text-white bg-danger rounded-circle cursor-pointer mx-auto" style="width:30px; height:30px" data-bs-toggle="modal" data-bs-target="#GNB_Delete_Modal" @click="prepare_terminate(item)">
            <i class="bi bi-trash"></i>
          </div>
        </td>
      </tr>
    </template>
  </Table>

  <!-- Deallocate Modal -->
  <div class="modal fade" id="GNB_Deallocate_Modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Deallocate GNB</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body mx-1">
          Sure to deallocate this gNB instance?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ t('Cancel') }}</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="terminate">Deallocate</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Modal -->
  <div class="modal fade" id="GNB_Delete_Modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete GNB Instance</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body mx-1">
          Sure to delete this gNB instance?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ t('Cancel') }}</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="terminate">{{ t('Delete') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import Table from '../components/global/table.vue';
import { delay } from '@/assets/js/delay';

const { t } = useI18n();
const status = ref(false);

const th_list = [
  { name: 'gnbId',              text: `GNB ${t('Instance')} (GNB)` },
  { name: 'gnbInstanceName',    text: `${t('Network')}${t('Service')} (NS)` },
  { name: 'administrativeState', text: t('generic.status', [t('Administrative')]) },
  { name: 'operationalState',   text: t('generic.status', [t('Operational')]) },
  { name: 'Graph',              text: t('Graph') },
  { name: 'Deallocate',         text: t('Deallocate') },
  { name: 'Delete_GNB',         text: `${t('Delete')} GNB` },
];
const columnSort = ['gnbId', 'gnbInstanceName', 'administrativeState', 'operationalState'];

const td_list = ref([]);
const filterEntries = ref([]);
const selected = ref(null);

const fetchData = async () => {
  try {
    const res = await axios.get('/api/slice/v1/instances', {
      params: { componentType: 'GNB' },
    });
    const items = (res.data?.items || []).filter((x) => x.componentType === 'GNB');
    td_list.value = items.map((i) => ({
      gnbId: i.instanceId,
      gnbInstanceName: i.name || '',
      administrativeState: 'UNLOCKED',
      operationalState: i.status || 'UNKNOWN',
    }));
  } catch (e) {
    console.error(e);
    td_list.value = [];
  }
};

const updateTableData = (val) => {
  filterEntries.value = val;
};

const prepare_terminate = (item) => {
  selected.value = item;
};

const terminate = async () => {
  if (!selected.value) return;
  try {
    await axios.delete(`/api/slice/v1/instances/GNB/${selected.value.gnbId}`);
    await fetchData();
  } catch (e) {
    console.error(e);
    alert(`刪除失敗：${e.response?.status || e.message}`);
  } finally {
    selected.value = null;
  }
};

onBeforeMount(async () => {
  try { await fetchData(); } catch (e) { console.log(e); }
  await delay(700);
  status.value = true;
});
</script>
