import Connect from "@/libs/http/apiConfig";
export class authApi extends Connect {
    /**
     * @typedef  { name:String, password:String } login
     */
    /** 
     * @param { login } form - Information about the typedef login.
     * @returns
     */
    login(form){
        return super.post('SecurityManagement/login/', form)
    }
    
    /**
     * @typedef  { name:String, password:String, email:String } register
     */
    /**
     * @param { register } form - Information about the typedef register.
     * @returns
     */
    register(form){
        return super.post('SecurityManagement/register/', form)
    }
    
    getRole(){
        return super.get('SecurityManagement/get_role/')
    }

    logout(){
        return super.get('SecurityManagement/logout/')
    }

    public(){
        return super.get('SecurityManagement/switch_share/')
    }

    group_slice_allocate(form){
        return super.post('SecurityManagement/group_slice_allocate/', form)
    }

    get_ns_list(form){
        return super.get('SecurityManagement/get_nsi_list/', form)
    }

    get_ns_nssi(form){
        return super.post('SecurityManagement/get_ns_nssi/', form)
    }
    
}
