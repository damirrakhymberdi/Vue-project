<template>
  <div class="data-page">
    <!-- Заголовок страницы -->
    <div class="page-header">
      <h2>{{ title }}</h2>
      <div class="loading-indicator" v-if="loading">
        <div class="spinner"></div>
        <span>Загрузка данных...</span>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="filters-section">
      <div class="filters-grid">
        <div class="filter-group" v-for="filter in filters" :key="filter.key">
          <label :for="filter.key">{{ filter.label }}</label>
          <input
            v-if="filter.type === 'text'"
            :id="filter.key"
            v-model="filterValues[filter.key]"
            :placeholder="filter.placeholder"
            class="filter-input"
            @input="applyFilters"
          />
          <select
            v-else-if="filter.type === 'select'"
            :id="filter.key"
            v-model="filterValues[filter.key]"
            class="filter-select"
            @change="applyFilters"
          >
            <option value="">{{ filter.placeholder }}</option>
            <option v-for="option in filter.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      <button @click="clearFilters" class="clear-filters-btn">Очистить фильтры</button>
    </div>

    <!-- График -->
    <div class="chart-section">
      <h3>График: {{ chartTitle }}</h3>
      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>

    <!-- Таблица -->
    <div class="table-section">
      <h3>Таблица данных</h3>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th v-for="column in columns" :key="column.key" @click="sortBy(column.key)">
                {{ column.label }}
                <span v-if="sortField === column.key" class="sort-indicator">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td v-for="column in columns" :key="column.key">
                {{ formatCellValue(item[column.key], column.type) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Пагинация -->
      <div class="pagination">
        <button 
          @click="previousPage" 
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          Предыдущая
        </button>
        
        <span class="pagination-info">
          Страница {{ currentPage }} из {{ totalPages }}
          ({{ filteredData.length }} записей)
        </span>
        
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Следующая
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Регистрируем компоненты Chart.js
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  title: String,
  chartTitle: String,
  data: Array,
  columns: Array,
  filters: Array,
  chartType: {
    type: String,
    default: 'bar'
  },
  chartField: String,
  itemsPerPage: {
    type: Number,
    default: 10
  }
})

const loading = ref(false)
const filterValues = ref({})
const sortField = ref('')
const sortDirection = ref('asc')
const currentPage = ref(1)
const chartCanvas = ref(null)
let chartInstance = null

// Вычисляемые свойства
const filteredData = computed(() => {
  let result = [...props.data]
  
  // Применяем фильтры
  props.filters.forEach(filter => {
    const value = filterValues.value[filter.key]
    if (value && value !== '') {
      result = result.filter(item => {
        const itemValue = item[filter.key]
        if (filter.type === 'text') {
          return itemValue && itemValue.toString().toLowerCase().includes(value.toLowerCase())
        }
        return itemValue === value
      })
    }
  })
  
  // Применяем сортировку
  if (sortField.value) {
    result.sort((a, b) => {
      const aVal = a[sortField.value]
      const bVal = b[sortField.value]
      
      if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
  }
  
  return result
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / props.itemsPerPage)
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return filteredData.value.slice(start, end)
})

// Методы
const applyFilters = () => {
  currentPage.value = 1
  updateChart()
}

const clearFilters = () => {
  filterValues.value = {}
  currentPage.value = 1
  updateChart()
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const formatCellValue = (value, type) => {
  if (value === null || value === undefined) return '-'
  
  switch (type) {
    case 'date':
      return new Date(value).toLocaleDateString('ru-RU')
    case 'number':
      return new Intl.NumberFormat('ru-RU').format(value)
    case 'currency':
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      }).format(value)
    default:
      return value
  }
}

const updateChart = () => {
  if (!chartCanvas.value || !props.chartField) return
  
  const chartData = filteredData.value.slice(0, 20) // Показываем только первые 20 записей для читаемости
  
  const labels = chartData.map((item, index) => `Запись ${index + 1}`)
  const values = chartData.map(item => item[props.chartField] || 0)
  
  const config = {
    type: props.chartType,
    data: {
      labels,
      datasets: [{
        label: props.chartTitle,
        data: values,
        backgroundColor: props.chartType === 'bar' 
          ? 'rgba(54, 162, 235, 0.6)'
          : 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: props.chartTitle
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  }
  
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  chartInstance = new Chart(chartCanvas.value, config)
}

// Инициализация фильтров
const initializeFilters = () => {
  props.filters.forEach(filter => {
    filterValues.value[filter.key] = ''
  })
}

// Watchers
watch(() => props.data, () => {
  nextTick(() => {
    updateChart()
  })
}, { deep: true })

// Lifecycle
onMounted(() => {
  initializeFilters()
  nextTick(() => {
    updateChart()
  })
})
</script>

<style scoped>
.data-page {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.page-header h2 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  position: relative;
  z-index: 1;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.filters-section {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.filter-input,
.filter-select {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.clear-filters-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  position: relative;
  overflow: hidden;
}

.clear-filters-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.clear-filters-btn:hover::before {
  left: 100%;
}

.clear-filters-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.chart-section,
.table-section {
  padding: 24px;
}

.chart-section h3,
.table-section h3 {
  margin: 0 0 20px 0;
  color: #374151;
  font-size: 1.4rem;
  font-weight: 600;
  position: relative;
  padding-left: 16px;
}

.chart-section h3::before,
.table-section h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.chart-container {
  height: 400px;
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.data-table th,
.data-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.data-table th:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  transform: translateY(-1px);
}

.sort-indicator {
  margin-left: 5px;
  color: #667eea;
}

.data-table tbody tr {
  transition: all 0.2s ease;
}

.data-table tbody tr:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  transform: scale(1.01);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.pagination-btn {
  background: linear-gradient(135deg, #667eea 0%, #5a67d8 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.pagination-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.pagination-btn:hover:not(:disabled)::before {
  left: 100%;
}

.pagination-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.pagination-btn:disabled {
  background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.9rem;
}

.table-container {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
  
  .data-table {
    font-size: 0.8rem;
  }
  
  .data-table th,
  .data-table td {
    padding: 8px;
  }
  
  .page-header h2 {
    font-size: 1.5rem;
  }
  
  .chart-section h3,
  .table-section h3 {
    font-size: 1.2rem;
  }
}
</style>
