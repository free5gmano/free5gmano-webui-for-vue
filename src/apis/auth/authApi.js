import Connect from "@/libs/http/apiConfig";
// http://localhost:3000/upload_file_option
const auth = new Connect(process.env.VUE_APP_BASE_URL_proxyAuth, true)

/**
 * @typedef  { name:String, password:String } login
 */

/**
 * login 
 * @param { login } form Information about the typedef login.
 * @returns
 */
export const login = form => auth.post(`upload_file_option`, form);

// basic/login/

/**
 * @typedef  { name:String, password:String, email:String } register
 */

/**
 * register 
 * @param { register } form Information about the typedef register.
 * @returns
 */
export const register = form => auth.post('basic/register/', form);

export class authApi extends Connect {
    /**
     * @typedef  { name:String, password:String } login
     */
    /** 
     * @param { login } form - Information about the typedef login.
     * @returns
     */
    login(form){
        return super.post("SecurityManagement/login/", form);
    }
    
    /**
     * @typedef  { name:String, password:String, email:String } register
     */
    /**
     * @param { register } form - Information about the typedef register.
     * @returns
     */
    register(form){
        return super.post('basic/register/', form)
    }

}
