<template>
  <div
    class="modal fade"
    id="register_Modal"
    ref="modal_register"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">註冊</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12 mb-3">
              <label for="account" class="form-label">帳號 :</label>
              <input
                type="text"
                v-model="accountValue"
                class="form-control input-custom"
                :class="{ 'is-invalid': account_invalidated }"
                id="account"
                placeholder="帳號"
              />
            </div>
            <div class="col-12 col-md-6 mb-3">
              <label for="password" class="form-label">密碼 :</label>
              <input
                type="password"
                v-model="passwordValue"
                class="form-control input-custom"
                :class="{ 'is-invalid': password_invalidated }"
                id="password"
                placeholder="密碼"
              />
            </div>
            <div class="col-12 col-md-6 mb-3">
              <label for="password_confirm" class="form-label"
                >再次輸入密碼 :</label
              >
              <input
                type="password"
                v-model="checkPasswordValue"
                class="form-control input-custom"
                :class="{ 'is-invalid': checkPassword_invalidated }"
                id="password_confirm"
                placeholder="再次輸入密碼"
              />
            </div>
            <div v-if="registerValidate">
              <div
                v-for="(i, idx) in msg"
                :key="idx"
                class="col-12 d-flex align-items-center mb-2"
              >
                <i class="bi bi-exclamation-circle-fill text-danger"></i>
                <small class="text-danger ms-2">{{ i }}</small>
              </div>
            </div>
            <div class="text-center my-2">
              <button
                class="btn btn-success px-5"
                @click="registerButton"
              >
                註 冊
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref, watch } from "vue";
import { api } from "@/apis/api";
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.js';
const accountValue = ref("");
const passwordValue = ref("");
const checkPasswordValue = ref("");
const account_invalidated = ref();
const password_invalidated = ref();
const checkPassword_invalidated = ref();
const modal_register = ref(null);
let verifyPassed = ref(false);
let myModal = ref();
const registerValidate = ref(false);
const msg = ref([]);
const errName = ref();
const errMsg = ref();
watch(accountValue, () => {
  if (accountValue.value !== "") {
    account_invalidated.value = false;
  }
});
watch(passwordValue, () => {
  if (passwordValue.value !== "") {
    (password_invalidated.value = false),
      (checkPassword_invalidated.value = false);
  }
});

watch(checkPasswordValue, () => {
  if (checkPasswordValue.value !== "") {
    (password_invalidated.value = false),
      (checkPassword_invalidated.value = false);
  }
});

const registerButton = () => {
  msg.value = []
  if (accountValue.value === "") {
    registerValidate.value = true;
    msg.value.push("帳號不得為空值");
    account_invalidated.value = true;
  } else {
    if (accountValue.value == errName.value) {
      registerValidate.value = true;
      msg.value.push(errMsg.value);
      account_invalidated.value = true;
    } else {
      account_invalidated.value = false;
    }
  }
  if (
    passwordValue.value === "" ||
    passwordValue.value !== checkPasswordValue.value
  ) {
    password_invalidated.value = true;
    checkPassword_invalidated.value = true;
    registerValidate.value = true;
    msg.value.push("密碼有誤或與確認密碼不一致");
  } else {
    password_invalidated.value = false;
    checkPassword_invalidated.value = false;
  }
  const isPassed = verify();
  if (isPassed) {
    api
      .loadAuth()
      .register({
        name: accountValue.value,
        password: passwordValue.value,
      })
      .then((res) => {
        console.log(res);
        if (res.data.status == 0) {
            if (confirm(res.data.message)) {
               myModal.value.hide()
               clearValue();
            }
        } else {  
          account_invalidated.value = true;
          registerValidate.value = true;
          errName.value = accountValue.value;
          errMsg.value = res.data.message;
          msg.value.push(res.data.message);
        }
      });
  }
};

const verify = () => {
  return (verifyPassed.value =
    accountValue.value !== "" &&
    passwordValue.value !== "" &&
    checkPasswordValue.value !== "" &&
    passwordValue.value === checkPasswordValue.value
      ? true
      : false);
};

const clearValue = () => {
  accountValue.value = "";
  passwordValue.value = "";
  checkPasswordValue.value = "";
  registerValidate.value = false;
};
onMounted(()=>{
  myModal.value = new Modal(modal_register.value)
})
</script>
<style scoped>
.btn-success {
  background-color: #42b72a !important;
}
.input-custom {
  background-color: #f5f6f7;
}
</style>
