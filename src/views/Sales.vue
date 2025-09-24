<template>
  <DataPage
    title="Продажи"
    chart-title="Сумма продаж"
    :data="salesData"
    :columns="columns"
    :filters="filters"
    chart-type="bar"
    chart-field="totalPrice"
    :items-per-page="10"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataPage from '../components/DataPage.vue'
import { apiService } from '../services/api.js'

const salesData = ref([])

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
  { key: 'saleID', label: 'ID продажи', type: 'text' },
  { key: 'odid', label: 'ID заказа', type: 'number' },
  { key: 'nmId', label: 'Номенклатура', type: 'number' },
  { key: 'subject', label: 'Предмет', type: 'text' },
  { key: 'category', label: 'Категория', type: 'text' },
  { key: 'brand', label: 'Бренд', type: 'text' },
  { key: 'isSupply', label: 'Поставка', type: 'text' },
  { key: 'isRealization', label: 'Реализация', type: 'text' }
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
    key: 'subject',
    label: 'Предмет',
    type: 'text',
    placeholder: 'Введите предмет'
  },
  {
    key: 'isSupply',
    label: 'Тип поставки',
    type: 'select',
    placeholder: 'Выберите тип',
    options: [
      { value: 'true', label: 'Поставка' },
      { value: 'false', label: 'Не поставка' }
    ]
  },
  {
    key: 'oblast',
    label: 'Область',
    type: 'text',
    placeholder: 'Введите область'
  }
]

const loadSalesData = async () => {
  try {
    const data = await apiService.getSales()
    salesData.value = data || []
  } catch (error) {
    console.error('Ошибка загрузки данных о продажах:', error)
    // В случае ошибки показываем тестовые данные
    salesData.value = generateMockData()
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
  
  for (let i = 0; i < 45; i++) {
    mockData.push({
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastChangeDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      supplierArticle: `ART${3000 + i}`,
      techSize: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)],
      barcode: `${3000000000000 + i}`,
      quantity: Math.floor(Math.random() * 3) + 1,
      totalPrice: Math.floor(Math.random() * 12000) + 1500,
      discountPercent: Math.floor(Math.random() * 25),
      warehouseName: warehouses[Math.floor(Math.random() * warehouses.length)],
      oblast: oblasts[Math.floor(Math.random() * oblasts.length)],
      incomeID: 1000000 + i,
      saleID: `SALE${3000 + i}`,
      odid: 3000000 + i,
      nmId: 3000000 + i,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      isSupply: (Math.random() > 0.3).toString(),
      isRealization: (Math.random() > 0.1).toString()
    })
  }
  
  return mockData
}

onMounted(() => {
  loadSalesData()
})
</script>
