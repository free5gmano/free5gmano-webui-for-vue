import axios from "axios";
export default class Connect {
  constructor(baseUrl, withCredentials) {
    this.baseUrl = baseUrl;
    this.withCredentials = withCredentials
  }

  get(apiName) {
    const config = {
      baseURL: this.baseUrl,
      url: apiName,
      method: 'get',
    };
    return this.#call(config);
  }

  post(apiName, request) {
    const config = {
      baseURL: this.baseUrl,
      url: apiName,
      method: 'post',
      data: request,
    };
    return this.#call(config);
  }

  put(apiName, request) {
    const config = {
      baseURL: this.baseUrl,
      url: apiName,
      method: 'put',
      data: request
    };
    return this.#call(config);
  }

  patch(apiName, request) {
    const config = {
      baseURL: this.baseUrl,
      url: apiName,
      method: 'patch',
      data: request
    };
    return this.#call(config);
  }

  delete(apiName) {
    const config = {
      baseURL: this.baseUrl,
      url: apiName,
      method: 'delete',
    };
    return this.#call(config);
  }

  #call(config) {
    const instance = axios.create({
      timeout: 10000000,
      withCredentials: this.withCredentials
    });
    instance.interceptors.request.use((config) => {
      return config;
    });
    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              window.location.replace('/');
              break;
          }
        }
        return Promise.reject(error);
      }
    );
    return instance.request(config);
  }
}

