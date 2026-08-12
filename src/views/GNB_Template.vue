<template>
  <div class="content-wrap-custom">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="m-0">GNB Template List</h3>
      <button type="button" class="btn btn-outline-primary" @click="refresh">
        <i class="bi bi-arrow-clockwise me-1"></i> 重新整理
      </button>
    </div>

    <div class="card">
      <div class="card-body">
        <p class="text-muted small mb-3">
          來源：kube5gnfvo <code>/gnb/v1/gnb_templates</code>（透過 free5gmano <code>/slice/v1/resources?componentType=GNB</code>）
        </p>
        <div v-if="loading" class="text-center py-4 text-muted">讀取中…</div>
        <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-else-if="items.length === 0" class="alert alert-info mb-0">
          目前沒有已上架的 gNB 模板
        </div>
        <table v-else class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th style="width: 60px">#</th>
              <th>Template Name</th>
              <th>Template ID</th>
              <th>Description</th>
              <th style="width: 90px">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in items" :key="item.resourceId">
              <td>{{ idx + 1 }}</td>
              <td>
                <strong>{{ item.name }}</strong>
              </td>
              <td class="font-monospace small">{{ item.resourceId }}</td>
              <td class="small text-muted">{{ item.description || '—' }}</td>
              <td>
                <span class="badge bg-success">{{ item.status || 'READY' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const items = ref([]);
const loading = ref(true);
const error = ref('');

const fetchGnb = async () => {
  loading.value = true;
  error.value = '';
  try {
    // free5gmano 的 unified resources API (代理到 /api 走 vue-cli 設定)
    const res = await axios.get('/api/slice/v1/resources', {
      params: { componentType: 'GNB' },
    });
    items.value = (res.data?.items || []).filter(
      (x) => x.componentType === 'GNB'
    );
  } catch (e) {
    error.value = `讀取失敗：${e.response?.status || e.message}`;
  } finally {
    loading.value = false;
  }
};

const refresh = () => fetchGnb();
onMounted(fetchGnb);
</script>

<style scoped>
.content-wrap-custom {
  padding: 24px;
}
</style>
