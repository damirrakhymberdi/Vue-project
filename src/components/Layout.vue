<template>
  <div class="layout">
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <div class="logo-icon">📊</div>
          <h1 class="nav-title">WB Analytics</h1>
        </div>
        <ul class="nav-menu">
          <li class="nav-item">
            <router-link 
              to="/incomes" 
              class="nav-link"
              :class="{ active: $route.name === 'Incomes' }"
            >
              <span class="nav-icon">📥</span>
              <span class="nav-text">Поступления</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/orders" 
              class="nav-link"
              :class="{ active: $route.name === 'Orders' }"
            >
              <span class="nav-icon">🛒</span>
              <span class="nav-text">Заказы</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/sales" 
              class="nav-link"
              :class="{ active: $route.name === 'Sales' }"
            >
              <span class="nav-icon">💰</span>
              <span class="nav-text">Продажи</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/stocks" 
              class="nav-link"
              :class="{ active: $route.name === 'Stocks' }"
            >
              <span class="nav-icon">📦</span>
              <span class="nav-text">Склады</span>
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
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.nav-title {
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  letter-spacing: -0.5px;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 8px;
}

.nav-item {
  margin: 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 12px 20px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.nav-link:hover::before {
  left: 100%;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.25);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.nav-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
}

.nav-text {
  font-size: 0.95rem;
}

.main-content {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 16px 20px;
    gap: 16px;
  }
  
  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
  }
  
  .nav-title {
    font-size: 1.4rem;
  }
  
  .nav-link {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  .nav-text {
    display: none;
  }
  
  .main-content {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    width: 100%;
    justify-content: space-between;
  }
  
  .nav-link {
    flex: 1;
    justify-content: center;
    padding: 12px 8px;
  }
}
</style>
