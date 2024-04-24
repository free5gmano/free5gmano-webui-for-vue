/**
 * 
 * @param {string[]} formKey - form name
 * @param {Array} formData - form value
 * @returns {*} - FormData
 * 
 */

export const form = (formKey, formData) => {
  let form = new FormData();
  for (let index = 0; index < formKey.length; index++) {
    form.append(formKey[index], formData[index]);
  }
  return form;
};