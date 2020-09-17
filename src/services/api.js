import axios from 'axios'

const api = axios.create({
    baseURL: 'https://uki-event-manager.herokuapp.com'
})
export default api