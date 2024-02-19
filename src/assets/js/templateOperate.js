import { alertEvent } from "./alertData";
import { api } from "../../apis/api";
export const NFVO_create = async (form, getdata, alertData) => {
  const { Template, configSuccess, configUnsuccess } = alertData;
  try {
    await api.nfvManoPlugin().create(form);
    await getdata();
    alertEvent(1, Template, configSuccess);
  } catch (error) {
    console.log(error);
    alertEvent(0, Template, configUnsuccess);
  }
};

export const NFVO_update = async (updateData, getTableData, alertData) => {
  // 點擊 Update Modal 內更新按鈕
  const [fileName, form] = updateData;
  const { Template, configSuccess, configUnsuccess } = alertData;
  try {
    await api.nfvManoPlugin().update(fileName, form);
    await getTableData();
    alertEvent(1, Template, configSuccess);
  } catch (error) {
    console.log(error);
    alertEvent(0, Template, configUnsuccess);
  }
};

export const NFVO_delete = async (fileName, getTableData, alertData) => {
  const { Template, configSuccess, configUnsuccess } = alertData;
  try {
    await api.nfvManoPlugin().delete(fileName);
    await getTableData();
    alertEvent(1, Template, configSuccess);
  } catch (error) {
    console.log(error);
    alertEvent(0, Template, configUnsuccess);
  }
};
export const generic_create = async (form, getdata, alertData) => {
  const { Template, configSuccess, configUnsuccess } = alertData;
  try {
    await api.genericTemplate().create(form);
    await getdata();
    alertEvent(1, Template, configSuccess);
  } catch (error) {
    console.log(error);
    alertEvent(0, Template, configUnsuccess);
  }
};

export const generic_update = async (updateData, getTableData, alertData) => {
  const [fileName, form] = updateData;
  const { Template, configSuccess, configUnsuccess } = alertData;
  try {
    await api.genericTemplate().update(fileName, form);
    await getTableData();
    alertEvent(1, Template, configSuccess);
  } catch (error) {
    console.log(error);
    alertEvent(0, Template, configUnsuccess);
  }
};

export const generic_delete = async (fileName, getTableData, alertData) => {
  const { Template, configSuccess, configUnsuccess } = alertData;
  try {
    await api.genericTemplate().delete(fileName);
    await getTableData();
    alertEvent(1, Template, configSuccess);
  } catch (error) {
    console.log(error);
    alertEvent(0, Template, configUnsuccess);
  }
};
export const NSST_create = async (form, getdata, alertData) => {
  const { Template, configSuccess, configUnsuccess } = alertData;
  try {
    await api.nssTemplate().create(form);
    await getdata();
    alertEvent(1, Template, configSuccess);
  } catch (error) {
    console.log(error);
    alertEvent(0, Template, configUnsuccess);
  }
};
export const NSST_delete = async (fileName, getTableData, alertData) => {
  const { Template, configSuccess, configUnsuccess } = alertData;
  try {
    await api.nssTemplate().delete(fileName);
    await getTableData();
    alertEvent(1, Template, configSuccess);
  } catch (error) {
    console.log(error);
    alertEvent(0, Template, configUnsuccess);
  }
};

 export const callDownload = (file, alertData) => {
  const { Template, configSuccess, configUnsuccess } = alertData;
  if (file == null) alertEvent(0, Template, configUnsuccess);
  else alertEvent(1, Template, configSuccess);
};


