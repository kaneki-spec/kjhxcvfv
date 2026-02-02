// === SPRITELAB ADMIN PANEL ===

// State
let isAuthenticated = false;
let currentTab = 'dashboard';

// Demo data
const demoData = {
    apps: [
        { id: 1, name: 'SpriteLab Mobile', desc: 'Мобильное приложение для iOS и Android', icon: 'fa-mobile-alt' },
        { id: 2, name: 'SpriteLab Cloud', desc: 'Облачная платформа для бизнеса', icon: 'fa-cloud' },
        { id: 3, name: 'SpriteLab Analytics', desc: 'Система аналитики и отчётности', icon: 'fa-chart-bar' }
    ],
    users: [
        { id: 1, name: 'Александр Иванов', email: 'alex@example.com', status: 'active' },
        { id: 2, name: 'Мария Петрова', email: 'maria@example.com', status: 'active' },
        { id: 3, name: 'Дмитрий Сидоров', email: 'dmitry@example.com', status: 'inactive' }
    ],
    stats: {
        totalApps: 6,
        totalUsers: 127,
        totalDownloads: 15420,
        avgRating: 4.8
    }
};

// DOM Elements
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const loginBtn = document.getElementById('login');
const logoutBtn = document.getElementById('logout');
const usernameInput = document.getElementById('login-username');
const passwordInput = document.getElementById('login-password');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initAuth();
    checkSession();
});

// === AUTH ===
function initAuth() {
    loginBtn.addEventListener('click', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Enter key support
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') passwordInput.focus();
    });
}

function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!username || !password) {
        showToast('Заполните все поля', 'error');
        return;
    }
    
    // Demo auth (replace with real API)
    if (username === 'admin' && password === 'admin') {
        isAuthenticated = true;
        localStorage.setItem('spritelab_admin_auth', 'true');
        showApp();
        showToast('Добро пожаловать!', 'success');
    } else {
        showToast('Неверный логин или пароль', 'error');
        passwordInput.value = '';
    }
}

function handleLogout() {
    isAuthenticated = false;
    localStorage.removeItem('spritelab_admin_auth');
    showAuth();
    showToast('Вы вышли из системы', 'success');
}

function checkSession() {
    if (localStorage.getItem('spritelab_admin_auth') === 'true') {
        isAuthenticated = true;
        showApp();
    }
}

function showAuth() {
    authSection.classList.remove('hidden');
    appSection.classList.add('hidden');
    usernameInput.value = '';
    passwordInput.value = '';
}

function showApp() {
    authSection.classList.add('hidden');
    appSection.classList.remove('hidden');
    loadDashboard();
    loadApps();
    loadUsers();
}

// === TABS ===
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
    
    currentTab = tabName;
}

// === DASHBOARD ===
function loadDashboard() {
    document.getElementById('total-apps').textContent = demoData.stats.totalApps;
    document.getElementById('total-users').textContent = demoData.stats.totalUsers;
    document.getElementById('total-downloads').textContent = formatNumber(demoData.stats.totalDownloads);
    document.getElementById('avg-rating').textContent = demoData.stats.avgRating;
    
    // Animate numbers
    animateValue('total-apps', 0, demoData.stats.totalApps, 1000);
    animateValue('total-users', 0, demoData.stats.totalUsers, 1200);
    animateValue('total-downloads', 0, demoData.stats.totalDownloads, 1500);
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const current = Math.round(start + range * easeProgress);
        
        obj.textContent = id === 'avg-rating' ? current.toFixed(1) : formatNumber(current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// === APPS ===
function loadApps() {
    const appsList = document.getElementById('apps-list');
    
    if (demoData.apps.length === 0) {
        appsList.innerHTML = '<p class="empty-state">Приложения не найдены</p>';
        return;
    }
    
    appsList.innerHTML = demoData.apps.map(app => `
        <div class="app-item" data-id="${app.id}">
            <div class="app-item-icon">
                <i class="fas ${app.icon}"></i>
            </div>
            <div class="app-item-info">
                <div class="app-item-name">${app.name}</div>
                <div class="app-item-desc">${app.desc}</div>
            </div>
            <div class="app-item-actions">
                <button class="btn" onclick="editApp(${app.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn danger" onclick="deleteApp(${app.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function editApp(id) {
    showToast(`Редактирование приложения #${id}`, 'success');
}

function deleteApp(id) {
    if (confirm('Удалить это приложение?')) {
        demoData.apps = demoData.apps.filter(app => app.id !== id);
        loadApps();
        showToast('Приложение удалено', 'success');
    }
}

// Add app button
document.getElementById('add-app')?.addEventListener('click', () => {
    showToast('Открыто окно добавления', 'success');
});

// === USERS ===
function loadUsers() {
    const usersList = document.getElementById('users-list');
    
    if (demoData.users.length === 0) {
        usersList.innerHTML = '<p class="empty-state">Пользователи не найдены</p>';
        return;
    }
    
    usersList.innerHTML = demoData.users.map(user => `
        <div class="user-item" data-id="${user.id}">
            <div class="user-avatar">${user.name.charAt(0)}</div>
            <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
            </div>
            <div class="user-status ${user.status}">${user.status === 'active' ? 'Активен' : 'Неактивен'}</div>
        </div>
    `).join('');
}

// === SETTINGS ===
document.getElementById('save-settings')?.addEventListener('click', () => {
    const companyName = document.getElementById('company-name').value;
    const contactEmail = document.getElementById('contact-email').value;
    const telegram = document.getElementById('telegram-link').value;
    
    // Save settings (demo)
    console.log('Settings saved:', { companyName, contactEmail, telegram });
    showToast('Настройки сохранены', 'success');
});

// === UTILITIES ===
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// === TOGGLE SITE BUTTON ===
document.getElementById('toggle-site')?.addEventListener('click', () => {
    window.open('../index.html', '_blank');
});

