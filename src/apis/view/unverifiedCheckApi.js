import Connect from "@/libs/http/apiConfig";

export class unverifiedCheck extends Connect {

    unverifiedList(){
        return super.get('SecurityManagement/unverified_list/')
    }

    /**
     * @param { String[] } form
     * @returns
     */

    adminCheck(form){
        return super.post('SecurityManagement/admin_check/', form)
    }

}

