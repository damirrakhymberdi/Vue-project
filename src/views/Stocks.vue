<template>
  <DataPage
    title="Склады"
    chart-title="Количество на складе"
    :data="stocksData"
    :columns="columns"
    :filters="filters"
    chart-type="line"
    chart-field="quantity"
    :items-per-page="20"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataPage from '../components/DataPage.vue'
import { apiService } from '../services/api.js'

const stocksData = ref([])

const columns = [
  { key: 'lastChangeDate', label: 'Дата изменения', type: 'date' },
  { key: 'supplierArticle', label: 'Артикул поставщика', type: 'text' },
  { key: 'techSize', label: 'Размер', type: 'text' },
  { key: 'barcode', label: 'Штрихкод', type: 'text' },
  { key: 'quantity', label: 'Количество', type: 'number' },
  { key: 'quantityFull', label: 'Полное количество', type: 'number' },
  { key: 'quantityNotInOrders', label: 'Не в заказах', type: 'number' },
  { key: 'warehouse', label: 'Склад', type: 'number' },
  { key: 'warehouseName', label: 'Название склада', type: 'text' },
  { key: 'inWayToClient', label: 'В пути к клиенту', type: 'number' },
  { key: 'inWayFromClient', label: 'В пути от клиента', type: 'number' },
  { key: 'nmId', label: 'Номенклатура', type: 'number' },
  { key: 'subject', label: 'Предмет', type: 'text' },
  { key: 'category', label: 'Категория', type: 'text' },
  { key: 'brand', label: 'Бренд', type: 'text' },
  { key: 'scCode', label: 'Код склада', type: 'text' },
  { key: 'price', label: 'Цена', type: 'currency' },
  { key: 'discount', label: 'Скидка', type: 'currency' }
]

const filters = [
  {
    key: 'warehouseName',
    label: 'Название склада',
    type: 'text',
    placeholder: 'Введите название склада'
  },
  {
    key: 'brand',
    label: 'Бренд',
    type: 'text',
    placeholder: 'Введите бренд'
  },
  {
    key: 'category',
    label: 'Категория',
    type: 'text',
    placeholder: 'Введите категорию'
  },
  {
    key: 'subject',
    label: 'Предмет',
    type: 'text',
    placeholder: 'Введите предмет'
  },
  {
    key: 'techSize',
    label: 'Размер',
    type: 'text',
    placeholder: 'Введите размер'
  },
  {
    key: 'scCode',
    label: 'Код склада',
    type: 'text',
    placeholder: 'Введите код склада'
  }
]

const loadStocksData = async () => {
  try {
    const data = await apiService.getStocks()
    stocksData.value = data || []
  } catch (error) {
    console.error('Ошибка загрузки данных о складах:', error)
    // В случае ошибки показываем тестовые данные
    stocksData.value = generateMockData()
  }
}

// Генерируем тестовые данные для демонстрации
const generateMockData = () => {
  const mockData = []
  const warehouses = ['Склад 1', 'Склад 2', 'Склад 3', 'Склад 4']
  const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance']
  const categories = ['Обувь', 'Одежда', 'Аксессуары', 'Спорт']
  const subjects = ['Кроссовки', 'Футболка', 'Шорты', 'Кепка', 'Рюкзак']
  const scCodes = ['SC001', 'SC002', 'SC003', 'SC004']
  
  for (let i = 0; i < 80; i++) {
    const quantity = Math.floor(Math.random() * 100) + 1
    const price = Math.floor(Math.random() * 8000) + 1000
    const discount = Math.floor(Math.random() * 500)
    
    mockData.push({
      lastChangeDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      supplierArticle: `ART${4000 + i}`,
      techSize: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)],
      barcode: `${4000000000000 + i}`,
      quantity: quantity,
      quantityFull: quantity + Math.floor(Math.random() * 20),
      quantityNotInOrders: Math.floor(Math.random() * quantity),
      warehouse: Math.floor(Math.random() * 4) + 1,
      warehouseName: warehouses[Math.floor(Math.random() * warehouses.length)],
      inWayToClient: Math.floor(Math.random() * 10),
      inWayFromClient: Math.floor(Math.random() * 5),
      nmId: 4000000 + i,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      scCode: scCodes[Math.floor(Math.random() * scCodes.length)],
      price: price,
      discount: discount
    })
  }
  
  return mockData
}

onMounted(() => {
  loadStocksData()
})
</script>
