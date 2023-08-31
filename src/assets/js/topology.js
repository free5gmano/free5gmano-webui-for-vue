import router from '@/router';
import * as echarts from 'echarts';
import { ref } from 'vue';
import { api } from '../../apis/api'
import $ from 'jquery';
var label;
var datas, nssi_num;
let NSViewChartContent = ref();
var cluster_num = 0;
function show_nssi(dom, unmount) {
  var myChart;
  function myChartResize() {
    myChart.resize();
  }
  if (unmount) {
    window.removeEventListener('resize', myChartResize)
  }
  else {
    myChart = echarts.init(dom)
    window.addEventListener('resize', myChartResize)
    return myChart
  }
}

function nssiContent(myChart, id) {
  let nssiId;
  if (id) {
    nssiId = `/${id}/`
  } else {
    nssiId = '/'
  }
  return nssiId
}

function deallocate_nssi_topology(myChart, nssiID) {
  api.nssiTopology().showNssiTopology(nssiID)
    .then(response => {
      console.log(response)
      if (response.data.length) {
        for (var i = 1; i < response.data.length; i++) {
          var node_tal = response.data[0].nodes;
          var node = response.data[i].nodes;
          response.data[0].nodes = node_tal.concat(node);
          var link_tal = response.data[0].links;
          var link = response.data[i].links;
          response.data[0].links = link_tal.concat(link);
        }
        datas = response.data[0];
        nssi_num = response.data.length;
      } else {
        nssi_num = 1;
        datas = response.data;
      }
      var categories = [];
      datas.nodes.forEach(function (node) {
        node.itemStyle = null;
        node.category = node.attributes.modularity_class;
        node.value = node.category;
        // Use random x,y
        node.x = node.y = null;
        node.draggable = true;
      });
      categories[0] = {
        name: 'NSSI'
      };
      categories[1] = {
        name: "VNF",
        itemStyle: {
          color: "rgb(55, 206, 13)"
        }
      };
      label = false;
      myChart.setOption({
        tooltip: {},
        legend: [{
          data: categories.map(function (a) {
            return a.name;
          }),
          selected: {
            'NSI': false,
            'VNF': false
          }
        }],
        animation: false,
        series: [
          {
            type: 'graph',
            layout: 'force',
            data: datas.nodes,
            links: datas.links,
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],//[5,10]
            categories: categories,
            roam: true,
            label: {
              show: true,
              position: 'bottom',
              color: 'rgba(0, 0, 0, 1)',
            },
            lineStyle: {
              color: 'source',
            },
            emphasis: {
              lineStyle: {
                width: 10
              }
            },
            force: {
              repulsion: 100
            }
          }]
      });
      if (!response.data.length) {
        myChart.setOption({
          legend: [{
            selected: {
              'NSI': true,
              'VNF': true
            }
          }]
        });
      }
      NSViewChartContent.value = [`Total NSSI: ${nssi_num}`];
      delete_vnf(myChart, datas.nodes, nssiID);
    });
}

async function allocate_nssi(myChart, nsstID) {
  // return new Promise(resolve => {
  //   console.log(resolve)
  // myChart.showLoading();
  const json = JSON.stringify({ attributeListIn: { nsstid: nsstID, using_existed: "" } });
  // console.log(json);
  var nssiID ;
  await api.nssiTopology().allocateNssi(json)
    .then((response) => {
      nssiID = response.data.nSSIId;
    })
    .catch(() => {
      alert("ERROR!!");
    });
  return nssiID;
}


function show_allocate_nssi_topology(myChart, nssiID) {
  api.nssiTopology().showNssiTopology(nssiID)
    .then(response => {
      myChart.hideLoading();
      if (response.data.length) {
        for (var i = 1; i < response.data.length; i++) {
          var node_tal = response.data[0].nodes;
          var node = response.data[i].nodes;
          response.data[0].nodes = node_tal.concat(node);
          var link_tal = response.data[0].links;
          var link = response.data[i].links;
          response.data[0].links = link_tal.concat(link);
        }
        datas = response.data[0];
        nssi_num = response.data.length;
      }
      else {
        nssi_num = 1;
        datas = response.data;
      }
      var categories = [];
      datas.nodes.forEach(function (node) {
        node.itemStyle = null;
        node.category = node.attributes.modularity_class;
        node.value = node.category;
        // Use random x,y
        node.x = node.y = null;
        node.draggable = true;
      });

      categories[0] = {
        name: 'NSSI'
      };
      categories[1] = {
        name: "VNF",
        itemStyle: {
          color: "rgb(55, 206, 13)"
        }
      };
      categories[2] = {
        name: "MEC",
        itemStyle: {
          color: "rgb(160, 0, 160)"
        }
      };
      categories[3] = {
        name: "MECAPP",
        itemStyle: {
          color: "rgb(14, 241, 241)"
        }
      };

      myChart.setOption({
        tooltip: {},
        legend: [{
          data: categories.map(function (a) {
            return a.name;
          }),
          selected: {
            'NSI': false,
            'VNF': false
          }
        }],
        animation: false,
        series: [
          {
            type: 'graph',
            layout: 'force',
            data: datas.nodes,
            links: datas.links,
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            categories: categories,
            roam: true,
            label: {
              show: true,
              position: 'bottom',
              color: 'rgba(0, 0, 0, 1)',
            },
            lineStyle: {
              color: 'source',
            },
            emphasis: {
              lineStyle: {
                width: 10
              }
            },
            force: {
              repulsion: 100
            }
          }]
      });
      if (!response.data.length) {
        myChart.setOption({
          legend: [{
            selected: {
              'NSI': true,
              'VNF': true
            }
          }]
        });
      }
      NSViewChartContent.value = [`Total NSSI: ${nssi_num}`]
    });
}

async function show_group_allocate_nssi_topology(myChart, nssiID, apply_location) {
  var group_nsid;
  group_nsid = nssiID.split("|");
  group_nsid.pop();
  var data_collect = [];
  //取得所有nssi的拓樸圖
  for (var i = 0; i < group_nsid.length; i++) { 
    await api.nssiTopology().showNssiTopology(group_nsid[i])
      .then(response => {
        nssi_num = 1;
        datas = response.data;
        data_collect.push(datas);
      })
  }
  myChart.hideLoading();
  var data_links = [];
  var data_nodes = [];
  var location_linkd = [];
  var location_links = [];
  var location_nodes = [];
  var nodes_uuid = [];
  var nodes_uuid_duplicate = []

  //合併所有nssi的拓樸圖（點和線）
  for (var l = 0; l < data_collect.length; l++) {
    for (var e = 0; e < data_collect[l].links.length; e++) { 
      data_links.push(data_collect[l].links[e]);
    }
    for (var p = 0; p < data_collect[l].nodes.length; p++) { 
      data_nodes.push(data_collect[l].nodes[p]);
    }
  }

  //找出重複的MEC Cluster或Cloud Cluster的點
  var result = apply_location.apply_location.filter(function(element, index, arr){
      return arr.indexOf(element) === index;
  });
  for (i = 0; i < result.length; i++) {
    var uuid = _uuid();
    nodes_uuid.push(uuid)
    for (var j = 0; j < apply_location.apply_location.length; j++) {
      if(result[i] == apply_location.apply_location[j]){
        nodes_uuid_duplicate.push(uuid);
      }
    }
  }

  //造MEC Cluster或Cloud Cluster的點
  var cloud_index;
  for (i = 0; i < result.length; i++) {
    location_nodes.push($.extend(true, {}, data_nodes[0]));
    location_nodes[i].attributes.modularity_class = 4;
    location_nodes[i].id = nodes_uuid[i];
    location_nodes[i].name = result[i];
    location_nodes[i].symbolSize = 15 ;
    location_nodes[i].itemStyle = {};
    location_nodes[i].itemStyle.color = "rgb(242, 133, 0)"; 
    if (result[i].split("-")[0] == "Cloud"){
      cloud_index = i
    }
  }

  //造MEC Cluster或Cloud Cluster的線
  for (i = 0; i < result.length; i++) {
    if (cloud_index == i){
      continue;
    }
    else{
      location_linkd.push($.extend(true, {}, data_links[0]))
      location_linkd[location_linkd.length-1].id = result[i]+"to"+result[i-1];
      location_linkd[location_linkd.length-1].source = nodes_uuid[cloud_index];
      location_linkd[location_linkd.length-1].target = nodes_uuid[i];
    }
  }
  
  //造MEC Cluster和Cloud Cluster，與NSSI連的線
  for (i = 0; i < apply_location.nssi_list.length; i++) {
    location_links.push($.extend(true, {}, data_links[0]))
    location_links[i].id == apply_location.apply_location[i]+"to"+apply_location.nssi_list[i];
    location_links[i].source = nodes_uuid_duplicate[i];
    location_links[i].target = apply_location.nssi_list[i];
  }

  for (i = 0; i < location_nodes.length; i++) {
    data_nodes.push(location_nodes[i]);
  }

  for (i = 0; i < location_linkd.length; i++) {
    data_links.push(location_linkd[i]);
  }

  for (i = 0; i < location_links.length; i++) {
    data_links.push(location_links[i]);
  }
  //開始畫圖
  var categories = [];
  datas.nodes.forEach(function (node) {
    node.itemStyle = null;
    node.category = node.attributes.modularity_class;
    node.value = node.category;
    node.x = node.y = null;
    node.draggable = true;
  });

  categories[0] = {
    name: 'NSSI'
  };
  categories[1] = {
    name: "VNF",
    itemStyle: {
      color: "rgb(55, 206, 13)"
    }
  };
  // categories[2] = {
  //   name: "MEC",
  //   itemStyle: {
  //     color: "rgb(160, 0, 160)"
  //   }
  // };
  categories[2] = {
    name: "MEC App",
    itemStyle: {
      color: "rgb(14, 241, 241)"
    }
  };

  categories[3] = {
    name: "NFVI",
    itemStyle: {
      color: "rgb(242, 133, 0)"
    }
  };

  myChart.setOption({
    tooltip: {},
    legend: [{
      data: categories.map(function (a) {
        return a.name;
      }),
      selected: {
        'NSI': false,
        'VNF': false
      }
    }],
    animation: false,
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: data_nodes,
        links: data_links,
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        categories: categories,
        roam: true,
        label: {
          show: true,
          position: 'bottom',
          color: 'rgba(0, 0, 0, 1)',
        },
        lineStyle: {
          color: 'source',
        },
        emphasis: {
          lineStyle: {
            width: 10
          }
        },
        force: {
          repulsion: 100
        }
      }]
  });
  myChart.setOption({
    legend: [{
      selected: {
        'NSI': true,
        'VNF': true
      }
    }]
  });
  cluster_num = nodes_uuid.length
  NSViewChartContent.value = [
    `[free5gmano][Info] Total NSSI: ${group_nsid.length}`,
    `[free5gmano][Info] Total Cluster: ${nodes_uuid.length}`
  ]
}

async function chart_content_update(myChart, new_nssiID, apply_location, old_nssiID){
  await show_group_allocate_nssi_topology(myChart, new_nssiID, apply_location);
  old_nssiID = old_nssiID.split("|");
  old_nssiID.pop();
  new_nssiID = new_nssiID.split("|");
  new_nssiID.pop();
  var old_nssi = "";
  var new_nssi = "";
  let result = $(old_nssiID).not(new_nssiID).toArray().concat($(new_nssiID).not(old_nssiID).toArray())
  // let result = old_nssiID.filter((e)=>{
  //   return new_nssiID.indexOf(e) === -1
  // }).concat(new_nssiID.filter((f)=>{
  //   return old_nssiID.indexOf(f) === -1
  // }))
  console.log(result);
  for(var i=0;i<result.length; i++){
    if(old_nssiID.includes(result[i])){
      old_nssi += (result[i] + ",");
    }
    else{
      new_nssi += (result[i] + ",");
    }
  }
  // let dt = new Date();
  NSViewChartContent.value = [
    `[free5gmano][Info] Total NSSI: ${new_nssiID.length}`,
    `[free5gmano][Info] Total Cluster: ${cluster_num}`,
    `[AMS][Info] The nssi ${old_nssi} is mobility ${new_nssi}.`
  ]
}

function _uuid() {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function delete_vnf(myChart, nodes, nssiID) {
  api.nssiTopology().delete(nssiID)
    .then(() => {
      for (let i = nodes.length - 1; i >= 1; i--) {
        setTimeout(function () {
          nodes.pop();
          reload_nssi_topology(myChart, nodes);
          if (nodes.length == 1) {
            alert("NSSI Deallocate Success");
            router.push({
              name: 'NSS_Instance',
            })
          }
        }, i * 1000);
      }
    })
    .catch(() => {
      alert("NSSI in not allocated");
      router.push({
        name: 'NSS_Instance'
      })

    });
}

function myChartDbclick(myChart) {
  myChart.on('dblclick', function () {
    NSViewChartContent.value = [`Total NSSI: ${nssi_num}`]
  });
}

function myChartClick(myChart) {
  var nssi_switched = 0;
  myChart.on('click', { dataType: 'node' }, function (params) {
    switch (params.data.attributes.modularity_class) {
      case 1:
        NSViewChartContent.value = [
          `VNF id: ${params.data.id}`,
          `VNF name: ${params.name}`,
          `Address: ${params.data.address}`,
          `VNF State: ${params.data.vnfState}`,
          `Instantiation: ${params.data.instantiationState}`
        ]
        break;
      case 0:
        NSViewChartContent.value = [`NSSI id: ${params.data.id}`, `NSSI name: ${params.name}`]
        nssi_switched = !nssi_switched;
        label = !label;
        if (nssi_switched) {
          api.nssiTopology().nssiSwitched(params.data.id)
            .then(response => {
              var datas = response.data;
              // var categories = [];
              datas.nodes.forEach(function (node) {
                node.itemStyle = null;
                node.category = node.attributes.modularity_class;
                node.value = node.category;
                // Use random x,y
                node.x = node.y = null;
                node.draggable = true;
              });
              myChart.setOption({
                legend: [{
                  selected: {
                    'NSI': label,
                    'VNF': label
                  }
                }],
                series: [{
                  data: datas.nodes,
                  links: datas.links
                }]
              });
            });
          NSViewChartContent.value = [`NSSI id: ${params.data.id}`, `NSSI name: ${params.name}`]
        } else {
          myChart.setOption({
            legend: [{
              selected: {
                'NSI': label,
                'VNF': label
              }
            }],
            series: [{
              data: datas.nodes,
              links: datas.links
            }]
          });
          NSViewChartContent.value = [`Total NSSI: ${nssi_num}`]
        }
        break;
    }
  });
}

async function reload_nssi_topology(myChart, nodes) {
  myChart.setOption({
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: nodes,
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        roam: true,
        label: {
          show: true,
          position: 'bottom',
          color: 'rgba(0, 0, 0, 1)',
        },
        lineStyle: {
          color: 'source',
        },
        emphasis: {
          lineStyle: {
            width: 10
          }
        },
        force: {
          repulsion: 100
        }
      }]
  });
}
export { show_nssi, nssiContent, myChartDbclick, myChartClick, deallocate_nssi_topology, allocate_nssi, NSViewChartContent, show_allocate_nssi_topology, show_group_allocate_nssi_topology, chart_content_update}
