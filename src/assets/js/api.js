import axios from 'axios';
// const baseURL = 'govd/'
const baseURL = 'http://10.20.1.57:8000/';
// const baseURL = 'http://127.0.0.1:8000/';
// const baseURL = process.env.VUE_APP_BASE_URL;
const instance = axios.create({
  baseURL: baseURL,
  // baseURL:baseURL,
  // timeout: 3000,
});
const Share = () => {
  const PluginList = () => instance.get(`plugin/management/`);
  const TemplateList = () => instance.get(`ObjectManagement/GenericTemplate/`);
  return { PluginList, TemplateList }
};
const nss_template = () => {
  const selected = TemplateId => instance.get(`ObjectManagement/GenericTemplate/${TemplateId}/`);
  const nssTemplateList = () => instance.get(`ObjectManagement/SliceTemplate/`);
  const createNssTemplate = from => instance.post(`ObjectManagement/SliceTemplate/`, from);
  const deleteNssTemplate = templateId => instance.delete(`/ObjectManagement/SliceTemplate/${templateId}/`);
  return { selected, nssTemplateList, createNssTemplate, deleteNssTemplate }
};
const GenericTemplate = () => {
  const createGenericTemplate = from => instance.post(`ObjectManagement/GenericTemplate/`, from);
  const updateGenericTemplate = (upId, from) => instance.put(`ObjectManagement/GenericTemplate/${upId}/`, from);
  const deleteGenericTemplate = templateId => instance.delete(`ObjectManagement/GenericTemplate/${templateId}/`);
  return { createGenericTemplate, updateGenericTemplate, deleteGenericTemplate }
};
const nfv_mano_plugin = () => {
  const createPluginList = form => instance.post(`plugin/management/`, form);
  const updatePlugin = (pluginName, form) => instance.patch(`plugin/management/${pluginName}/`, form);
  const deletePlugin = templateId => instance.delete(`plugin/management/${templateId}/`);
  return { createPluginList, updatePlugin, deletePlugin }
};
const NSS_Instance = () => {
  const deleteNssi = nssiId => instance.delete(`ObjectManagement/NetworkSliceSubnet/${nssiId}/?scope=[%27BASE_NTH_LEVEL%27,0]`);
  const nssInstanceIist = () => instance.get(`ObjectManagement/NetworkSliceSubnet/*/?scope=[%27BASE_NTH_LEVEL%27,1]`);
  return { nssInstanceIist, deleteNssi }
};
const nssi_topology = () => {
  const showNssi = id => instance.get(`ObjectManagement/NSS/topology${id}`);
  const nssiSwitched = paramsId => instance.get(`ObjectManagement/NSS/topology/${paramsId}/`);
  const showNssiTopology = id => instance.get(`ObjectManagement/NSS/topology/${id}/`);
  const deleteVnf = nssiID => instance.delete(`ObjectManagement/NSS/SliceProfiles/${nssiID}/`);
  const allocateNssi = json => instance.post(`ObjectManagement/NSS/SliceProfiles/`, json, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const showAllocateNssiTopology = nssiID => instance.get(`ObjectManagement/NSS/topology/${nssiID}`);
  // const showAllocateNssiTopology = nssiID => instance.get(`ObjectManagement/NSS/topology/${nssiID}/${slicename`);

  return { showNssi, nssiSwitched, showNssiTopology, deleteVnf, allocateNssi, showAllocateNssiTopology }
};
export { Share, nss_template, GenericTemplate, nfv_mano_plugin, NSS_Instance, nssi_topology }