import axios from 'axios'

const API_BASE_URL = 'http://109.73.206.144:6969'
const API_KEY = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    }
})

// API методы для каждого эндпоинта
export const apiService = {
    // Получить данные о поступлениях
    async getIncomes(params = {}) {
        try {
            const response = await apiClient.get('/incomes', { params })
            return response.data
        } catch (error) {
            console.error('Error fetching incomes:', error)
            throw error
        }
    },

    // Получить данные о заказах
    async getOrders(params = {}) {
        try {
            const response = await apiClient.get('/orders', { params })
            return response.data
        } catch (error) {
            console.error('Error fetching orders:', error)
            throw error
        }
    },

    // Получить данные о продажах
    async getSales(params = {}) {
        try {
            const response = await apiClient.get('/sales', { params })
            return response.data
        } catch (error) {
            console.error('Error fetching sales:', error)
            throw error
        }
    },

    // Получить данные о складах
    async getStocks(params = {}) {
        try {
            const response = await apiClient.get('/stocks', { params })
            return response.data
        } catch (error) {
            console.error('Error fetching stocks:', error)
            throw error
        }
    }
}

export default apiService
