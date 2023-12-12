import axios from 'axios'


const instance = axios.create({
    baseURL: 'http://localhost:4444/'
})


// middleware
// Будет при каждом запросе проверять есть токен или нет

instance.interceptors.request.use((config) => {
    config.headers.Authorization = localStorage.getItem('token')
    return config
})


export default instance