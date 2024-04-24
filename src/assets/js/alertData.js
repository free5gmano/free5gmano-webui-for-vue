import { delay } from './delay';
import { reactive, toRefs } from "vue";
export const alertConfig = reactive({
  alertRef: null, // alert1 對應的 ref
  alertExist: false, // alert1 是否存在
});
const { alertRef, alertExist } = toRefs(alertConfig);
export const alertEvent = async (status, name, action) => { // 通知事件
  alertExist.value = true;
  await alertRef.value.alertInfo(status, name, action);
  await delay(100);
  alertExist.value = false;
};