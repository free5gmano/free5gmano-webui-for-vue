<template>
  <div class="modal fade" id="change_page_Modal" ref="modal_page" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" @keypress.enter="validate">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body d-flex align-items-center flex-wrap p-2 p-sm-3">
          <div class="col-12 col-sm d-flex justify-content-center align-items-center py-1">
            <span>switch page</span>
            <input type="text" inputmode="numeric" class="form-control input-custom text-center mx-2" :class="{ 'border-danger' : number_validate }" v-model="pageNumber">
            <span>of {{ allPages }} pages</span>
          </div>
          <button type="button" class="btn btn-primary text-white col col-sm-auto mt-2 mt-sm-0" @click="validate">Go</button>
          <div class="col-12 d-flex justify-content-center align-items-center mt-2 mt-sm-2" :class="{ 'd-none' : !number_validate }">
            <i class="bi bi-exclamation-circle-fill text-danger"></i>
            <small class="text-danger ms-2">請輸入有效整數</small>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>
<script setup>
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.js';
import { ref, toRefs, watch, onMounted, defineProps, defineEmits } from 'vue';
const props = defineProps({
  allPages: {
    type: Number,
    required: true,
  }
});
const { allPages } = toRefs(props);
let modal;
const pageNumber = ref('');
const modal_page = ref(null);
const number_validate = ref(false);
const emit = defineEmits(['switch']);
const validate = () => {
  const re = /^[0-9]+$/;
  const number = parseInt(pageNumber.value);
  if(!re.test(number) || (number > allPages.value || number <= 0))
    number_validate.value = true;
  if(!number_validate.value) {
    emit('switch', number);
    modal.hide();
  }
};

watch(pageNumber, () => { number_validate.value = false; });
  
onMounted(() => {
  modal = new Modal(modal_page.value, {});
  modal_page.value.addEventListener('hidden.bs.modal', () => {
    pageNumber.value = '';
    number_validate.value = false;
  });
});
</script>
<style scoped>
.input-custom {
  width: 65px;
}
</style>