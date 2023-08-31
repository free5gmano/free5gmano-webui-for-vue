import { ref, reactive } from 'vue'
export const text_invalidated = ref(false);
export const file_invalidated = ref(false);
export const select_invalidated = ref(false);
export const selects_invalidated = reactive({});

/**
 * 
 * @param {Array} text - index 0 repeatName index 1 fileName
 * @returns 
 */

const text_Validate = text => {
  const [repeatName, fileName] = text;
  if(repeatName || fileName == '') {
    text_invalidated.value = true;
    return false;
  }
  else 
    return true;
};

const select_Validate = (option, set) => {
  if(option == set) {
    select_invalidated.value = true;
    return false;
  }
  else
    return true;
};

const set_selects_invalidated = selectKey => {
  for(const iterator of selectKey) 
    selects_invalidated[iterator] = false;
};

const selects_Validate = (options, set) => {
  for(const iterator of options) 
    if(iterator[1] == set)
      selects_invalidated[iterator[0]] = true;
};

/**
 * 
 * @param {string} file - fileData 
 * @returns 
 */

const file_Validate = file => {
  if(file == null) 
    file_invalidated.value = true;
  else 
    return true;
};

export { text_Validate, file_Validate, select_Validate, set_selects_invalidated, selects_Validate }

