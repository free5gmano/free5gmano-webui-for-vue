<template>
  <div class="modal fade" id="create_plugin_Modal" ref="modal_create" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            <slot name="header"></slot>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body mx-1">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ t('Cancel') }}</button>
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.js';
import { ref, onMounted, defineEmits, defineExpose } from 'vue';
let modal;
const { t } = useI18n();
const modal_create = ref(null);
const emit = defineEmits(['remove']);
const closeModalEvent = () => modal.hide();
const focusModalEvent = () => modal_create.value.focus();

onMounted(() => {
  modal = new Modal(modal_create.value, {});
  modal_create.value.addEventListener('hidden.bs.modal', () => {
    emit('remove');
  });
});

defineExpose({
  closeModalEvent,
  focusModalEvent,
});
</script>