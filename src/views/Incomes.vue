<template>
  <DataPage
    title="Поступления"
    chart-title="Сумма поступлений"
    :data="incomesData"
    :columns="columns"
    :filters="filters"
    chart-type="bar"
    chart-field="totalPrice"
    :items-per-page="15"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataPage from '../components/DataPage.vue'
import { apiService } from '../services/api.js'

const incomesData = ref([])

const columns = [
  { key: 'date', label: 'Дата', type: 'date' },
  { key: 'lastChangeDate', label: 'Дата изменения', type: 'date' },
  { key: 'supplierArticle', label: 'Артикул поставщика', type: 'text' },
  { key: 'techSize', label: 'Размер', type: 'text' },
  { key: 'barcode', label: 'Штрихкод', type: 'text' },
  { key: 'quantity', label: 'Количество', type: 'number' },
  { key: 'totalPrice', label: 'Общая цена', type: 'currency' },
  { key: 'dateClose', label: 'Дата закрытия', type: 'date' },
  { key: 'warehouseName', label: 'Склад', type: 'text' },
  { key: 'nmId', label: 'Номенклатура', type: 'number' },
  { key: 'status', label: 'Статус', type: 'text' }
]

const filters = [
  {
    key: 'warehouseName',
    label: 'Склад',
    type: 'text',
    placeholder: 'Введите название склада'
  },
  {
    key: 'supplierArticle',
    label: 'Артикул поставщика',
    type: 'text',
    placeholder: 'Введите артикул'
  },
  {
    key: 'status',
    label: 'Статус',
    type: 'select',
    placeholder: 'Выберите статус',
    options: [
      { value: 'Принято', label: 'Принято' },
      { value: 'Отменено', label: 'Отменено' },
      { value: 'В пути', label: 'В пути' }
    ]
  },
  {
    key: 'techSize',
    label: 'Размер',
    type: 'text',
    placeholder: 'Введите размер'
  }
]

const loadIncomesData = async () => {
  try {
    const data = await apiService.getIncomes()
    incomesData.value = data || []
  } catch (error) {
    console.error('Ошибка загрузки данных о поступлениях:', error)
    // В случае ошибки показываем тестовые данные
    incomesData.value = generateMockData()
  }
}

// Генерируем тестовые данные для демонстрации
const generateMockData = () => {
  const mockData = []
  const warehouses = ['Склад 1', 'Склад 2', 'Склад 3']
  const statuses = ['Принято', 'Отменено', 'В пути']
  const sizes = ['S', 'M', 'L', 'XL']
  
  for (let i = 0; i < 50; i++) {
    mockData.push({
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastChangeDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      supplierArticle: `ART${1000 + i}`,
      techSize: sizes[Math.floor(Math.random() * sizes.length)],
      barcode: `${1000000000000 + i}`,
      quantity: Math.floor(Math.random() * 100) + 1,
      totalPrice: Math.floor(Math.random() * 10000) + 1000,
      dateClose: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      warehouseName: warehouses[Math.floor(Math.random() * warehouses.length)],
      nmId: 1000000 + i,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    })
  }
  
  return mockData
}

onMounted(() => {
  loadIncomesData()
})
</script>
