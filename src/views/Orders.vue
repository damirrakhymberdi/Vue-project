<template>
  <DataPage
    title="Заказы"
    chart-title="Сумма заказов"
    :data="ordersData"
    :columns="columns"
    :filters="filters"
    chart-type="line"
    chart-field="totalPrice"
    :items-per-page="12"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataPage from '../components/DataPage.vue'
import { apiService } from '../services/api.js'

const ordersData = ref([])

const columns = [
  { key: 'date', label: 'Дата', type: 'date' },
  { key: 'lastChangeDate', label: 'Дата изменения', type: 'date' },
  { key: 'supplierArticle', label: 'Артикул поставщика', type: 'text' },
  { key: 'techSize', label: 'Размер', type: 'text' },
  { key: 'barcode', label: 'Штрихкод', type: 'text' },
  { key: 'quantity', label: 'Количество', type: 'number' },
  { key: 'totalPrice', label: 'Общая цена', type: 'currency' },
  { key: 'discountPercent', label: 'Скидка %', type: 'number' },
  { key: 'warehouseName', label: 'Склад', type: 'text' },
  { key: 'oblast', label: 'Область', type: 'text' },
  { key: 'incomeID', label: 'ID поступления', type: 'number' },
  { key: 'odid', label: 'ID заказа', type: 'number' },
  { key: 'nmId', label: 'Номенклатура', type: 'number' },
  { key: 'subject', label: 'Предмет', type: 'text' },
  { key: 'category', label: 'Категория', type: 'text' },
  { key: 'brand', label: 'Бренд', type: 'text' },
  { key: 'isCancel', label: 'Отменен', type: 'text' },
  { key: 'cancel_dt', label: 'Дата отмены', type: 'date' }
]

const filters = [
  {
    key: 'warehouseName',
    label: 'Склад',
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
    key: 'isCancel',
    label: 'Статус заказа',
    type: 'select',
    placeholder: 'Выберите статус',
    options: [
      { value: 'false', label: 'Активный' },
      { value: 'true', label: 'Отменен' }
    ]
  },
  {
    key: 'oblast',
    label: 'Область',
    type: 'text',
    placeholder: 'Введите область'
  }
]

const loadOrdersData = async () => {
  try {
    const data = await apiService.getOrders()
    ordersData.value = data || []
  } catch (error) {
    console.error('Ошибка загрузки данных о заказах:', error)
    // В случае ошибки показываем тестовые данные
    ordersData.value = generateMockData()
  }
}

// Генерируем тестовые данные для демонстрации
const generateMockData = () => {
  const mockData = []
  const warehouses = ['Склад 1', 'Склад 2', 'Склад 3']
  const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance']
  const categories = ['Обувь', 'Одежда', 'Аксессуары', 'Спорт']
  const oblasts = ['Московская', 'Санкт-Петербург', 'Новосибирская', 'Екатеринбургская']
  const subjects = ['Кроссовки', 'Футболка', 'Шорты', 'Кепка', 'Рюкзак']
  
  for (let i = 0; i < 60; i++) {
    const isCancel = Math.random() > 0.8
    mockData.push({
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastChangeDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      supplierArticle: `ART${2000 + i}`,
      techSize: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)],
      barcode: `${2000000000000 + i}`,
      quantity: Math.floor(Math.random() * 5) + 1,
      totalPrice: Math.floor(Math.random() * 15000) + 2000,
      discountPercent: Math.floor(Math.random() * 30),
      warehouseName: warehouses[Math.floor(Math.random() * warehouses.length)],
      oblast: oblasts[Math.floor(Math.random() * oblasts.length)],
      incomeID: 1000000 + i,
      odid: 2000000 + i,
      nmId: 2000000 + i,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      isCancel: isCancel.toString(),
      cancel_dt: isCancel ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString() : null
    })
  }
  
  return mockData
}

onMounted(() => {
  loadOrdersData()
})
</script>
