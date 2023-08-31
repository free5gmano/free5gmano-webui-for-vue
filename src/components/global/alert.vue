<template>
  <div :class="['position-fixed alert', [ alertStatus == 1 ? 'alert-success' : 'alert-danger' ], 'alert-custom fade', { 'show' : alertShow }]" role="alert">
    <i :class="[ alertStatus == 1 ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill' ]"></i>
    <span class="ms-2">{{ alertTitle }}</span>
    <hr>
    <p class="mb-0">{{ content }}</p>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { delay } from '@/assets/js/delay';
import { ref, computed, defineExpose } from 'vue';  
const { t } = useI18n();
const alertShow = ref(false);
const alertStatus = ref(null);
const alertAction = ref(null);
const alertComponent = ref(null);
const nssiStatus = ref(false);
const content = ref('');
const alertTitle = computed(() => {
  if(alertStatus.value) 
    return t('alertData.successfully');
  else 
    return t('alertData.unSuccessfully');
});
const alertContent = computed(() => {
  if(alertStatus.value)
    return `${t('alertData.contentSuccess', [alertComponent.value, alertAction.value])} !`;
  else 
    return `${t('alertData.contentUnsuccess', [alertAction.value, alertComponent.value])} !`;
});
const NSSIAlertContent = computed(() => {
  if(alertStatus.value)
    return `${ alertComponent.value } ${ alertAction.value }${ t('Success') } !`;
  else 
    return `${ alertComponent.value } ${ t('yet') }${ alertAction.value } !!`;
});
const alertInfo = async (status, name, action, nssi = false) => {
  if(nssi)
    content.value = NSSIAlertContent;
  else 
    content.value = alertContent;
  alertShow.value = true;
  alertComponent.value = name;
  alertStatus.value = status;
  alertAction.value = action;
  await delay(1500);
  alertShow.value = false;
};

defineExpose({
  alertInfo,
  nssiStatus,
});
</script>
<style scoped>
.alert-custom {
  width: 85%;
  top: 80px;
  right: 50%;
  z-index: 999;
  transform: translateX(50%);
}
@media (min-width: 576px) {
  .alert-custom {
    width: auto;
    right: 24px;
    transform: translateX(0%);
  }
}
</style>