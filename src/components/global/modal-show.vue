<template>
  <div class="modal fade" id="show_plugin_Modal" ref="modal_show" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
      </div>
    </div>
  </div>
</template>
<script setup>
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.js';
import { ref, onMounted, defineEmits, defineExpose } from 'vue';
let modal;
const modal_show = ref(null);
const emit = defineEmits(['remove']);

onMounted(() => {
  modal = new Modal(modal_show.value, {});
  modal_show.value.addEventListener('hidden.bs.modal', () => {
    emit('remove')
  })
});

defineExpose({
  modal,
});
</script>