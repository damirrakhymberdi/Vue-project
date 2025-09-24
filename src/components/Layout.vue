<template>
  <div class="layout">
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="nav-title">WB Analytics Dashboard</h1>
        <ul class="nav-menu">
          <li class="nav-item">
            <router-link 
              to="/incomes" 
              class="nav-link"
              :class="{ active: $route.name === 'Incomes' }"
            >
              Поступления
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/orders" 
              class="nav-link"
              :class="{ active: $route.name === 'Orders' }"
            >
              Заказы
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/sales" 
              class="nav-link"
              :class="{ active: $route.name === 'Sales' }"
            >
              Продажи
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/stocks" 
              class="nav-link"
              :class="{ active: $route.name === 'Stocks' }"
            >
              Склады
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// Layout компонент для навигации
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.nav-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 20px;
}

.nav-item {
  margin: 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
  }
  
  .nav-menu {
    margin-top: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-title {
    font-size: 1.2rem;
  }
}
</style>
