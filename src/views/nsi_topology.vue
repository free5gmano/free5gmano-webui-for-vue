<template>
  <div class="container-outer user-select-none h-100 p-4" style="overflow : hidden">
  <div class="d-flex flex-column  user-select-none">
    <div class="container-header d-flex justify-content-between align-items-center mb-4">
      <h3>
        {{ title }}
      </h3>
    </div>
  </div>
    <div class="row">
    <!-- Graph Chart -->
      <div class="col-lg-7 col-12">
          <div class="card shadow mb-4 mb-lg-0" >
          <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">{{ t('Graph') }} {{ t('view') }}</h6>
          </div>
          <div class="card-body">
              <div class="chart-area">
                <div ref="dom" id="container"  class=" d-flex justify-content-center h-100"></div>
                <hr>
              </div>
          </div>
          </div>
      </div>
      <!-- view Chart -->
      <div class="col-lg-5 col-12">
          <div class="card shadow ">
          <!-- Card Header - Dropdown -->
          <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">{{ t('Information') }}</h6>
          </div>
          <!-- Card Body -->
          <div class="card-body">
              <div class="chart-pie pt-4">
                <div ref="viewChart" id="NS-view-Chart"></div>
                <p class="m-0" v-for="item in NSViewChartContent" :key="item">{{ item }}</p>
              </div>
              <hr>
          </div>
          </div>
      </div>
    </div>
</div>

</template>
<script setup>
import { api } from "@/apis/api";
import { useI18n } from 'vue-i18n'
import { useRoute } from "vue-router";
import { ref, watch, onMounted, onBeforeUnmount } from '@vue/runtime-core';
import { show_nssi, nssiContent, myChartDbclick, myChartClick, allocate_nssi, deallocate_nssi_topology, NSViewChartContent, show_allocate_nssi_topology, show_group_allocate_nssi_topology } from '@/assets/js/topology'

let mychart;
const dom = ref(null);
const { t } = useI18n();
const route = useRoute();
const NSSI_status = ref('NSSI');
const title = ref(`${ t('NSSI') }${ t('Graph') }`);
if(route.query.id)
  title.value = `${ route.query.id } ${ t('Graph') }`;
const topology = async() => {
  mychart.showLoading();
  console.log(route.query.status)
  var nssiID;
  var groupNssiId;
  var apply_location;
  if(route.query.status == "deallocate") {
    NSSI_status.value = "deallocate"; 
    deallocate_nssi_topology(mychart, route.query.id);
  }
  else if(route.query.status == "allocate") {
    NSSI_status.value = "allocate"; 
    nssiID =  await allocate_nssi(mychart, route.query.id);
    show_allocate_nssi_topology(mychart, nssiID);
  }
  else if(route.query.status == "group_allocate") {
    NSSI_status.value = "allocate"; 
    nssiID = "";
    groupNssiId = "";

    if (route.query.nssinum == 0) {
       console.log("please check");
    }
    else if (route.query.nssinum < 2) {
       nssiID +=  await allocate_nssi(mychart, route.query.id[0]);
       show_allocate_nssi_topology(mychart, nssiID);
    }
    else {
      for (let index = 0; index < route.query.nssinum; index++) {
        nssiID =  await allocate_nssi(mychart, route.query.id[index]);
        groupNssiId += nssiID;
        groupNssiId += "|";
      }
      await api.loadAuth().group_slice_allocate({nssi_list: groupNssiId}).then(response => {
        apply_location = response.data
      })
      show_group_allocate_nssi_topology(mychart, groupNssiId, apply_location);
    }
  }
  else if(route.query.status == "nsi_show") {
    await api.loadAuth().get_ns_nssi({nsi_id: route.query.id}).then(response => {
      apply_location = response.data
    })
    groupNssiId = "";
    for (let index = 0; index < apply_location.nssi_list.length; index++) {
      groupNssiId += apply_location.nssi_list[index];
      groupNssiId += "|";
    }
    console.log(groupNssiId)

    show_group_allocate_nssi_topology(mychart, groupNssiId, apply_location);
  }
  else {
    NSSI_status.value = "show";
    nssiID =  nssiContent(mychart, route.query.id);
    myChartDbclick(mychart);
    myChartClick(mychart);
    show_allocate_nssi_topology(mychart, nssiID);
  }
};

watch(NSViewChartContent, () => {
  return NSViewChartContent;
});

onMounted(() => {
  mychart = show_nssi(dom.value, false);
  topology();
});

onBeforeUnmount(() => {
  show_nssi(dom.value, true);
});
</script>
<style>
.chart-pie {
  position: relative;
  height: 15rem;
  width: 100%;
}
.chart-area {
  position: relative;
  height: 18rem;
  width: 100%;
}
.echarts {
  width: 100%;
  height: 400px; 
}
.h-100 {
  height: 100%;
}
@media (min-width: 990px) {
  .chart-pie {
    height: calc(20rem - 43px) !important;
  }
  .chart-area {
    height: 40rem;
  }
}
</style>