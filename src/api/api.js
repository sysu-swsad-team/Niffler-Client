import axios from 'axios'

// let base = 'http://127.0.0.1:8080'
axios.defaults.baseURL = 'http://127.0.0.1:8000'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'

const header = {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}

export const postLogin = params => {
  return axios.post('/questionnaire/login/', params, header)
}

export const deleteQN = params => {
  return axios.post('/questionnaire/mine/delete/', params, header)
}

export const postRegister = params => {
  return axios.post('/questionnaire/register/', params, header)
}

export const postAvatar = params => {
  return axios.post('/questionnaire/avatar/', params, {headers: {'Content-Type': 'image/jpeg'}})
}

export const postVercode = params => {
  return axios.post('/questionnaire/register/vercode/', params, header)
}

export const summitQN = params => {
  return axios.post('questionnaire/create/', params, header)
}

export const getAllQN = params => {
  return axios.get('questionnaire/task/', params, header)
}

export const getMyQN = params => {
  return axios.get('questionnaire/mine/', params, header)
}

export const getMyQNFilter = params => {
  return axios.get('questionnaire/mine/filter', params, header)
}

// export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }) }

// export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }) }

// export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }) }

// export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }) }

// export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }) }

// export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }) }
