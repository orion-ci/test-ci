import axios from './../tools/axios'
const baseUrl = 'http://mocker.jinuo.fun'

export default {
  getProjectList (data, callback) {
    axios.get(`${baseUrl}/api/projects`, {params: data})
      .then(res => {
        callback(res)
      })
  }

}
