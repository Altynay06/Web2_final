// js/auth.js
let currentUser = null;

// Функция для показа уведомлений
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    
    if (type === 'error') {
        toast.style.borderLeftColor = '#ff4444';
        toast.style.background = 'rgba(255, 68, 68, 0.1)';
    } else if (type === 'info') {
        toast.style.borderLeftColor = '#17a2b8';
        toast.style.background = 'rgba(23, 162, 184, 0.1)';
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Проверка авторизации
function checkAuth() {
    const userData = localStorage.getItem('user');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateAuthUI();
        return currentUser;
    }
    return null;
}

// Обновление UI
function updateAuthUI() {
    const signBtn = document.getElementById('openAccessModal');
    const profileBtn = document.getElementById('profileBtn');
    
    if (currentUser && signBtn) {
        signBtn.textContent = currentUser.name;
        signBtn.classList.remove('btn-danger');
        signBtn.classList.add('btn-success');
        
        if (profileBtn) {
            profileBtn.style.display = 'inline-block';
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    const modal = document.getElementById('accessModal');
    const closeBtn = modal?.querySelector('.close-button');
    const openBtn = document.getElementById('openAccessModal');
    
    if (openBtn) {
        openBtn.addEventListener('click', function() {
            if (currentUser) {
                showToast(`Welcome back, ${currentUser.name}!`, 'info');
                return;
            }
            modal.style.display = 'flex';
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Переключение между логином и регистрацией
    document.getElementById('showRegister')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('loginPanel').style.display = 'none';
        document.getElementById('registerPanel').style.display = 'block';
        document.getElementById('modalAccessTitle').textContent = 'Register for MyFlix';
    });
    
    document.getElementById('showLogin')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('registerPanel').style.display = 'none';
        document.getElementById('loginPanel').style.display = 'block';
        document.getElementById('modalAccessTitle').textContent = 'Sign In to MyFlix';
    });
    
    // Регистрация
    document.getElementById('registrationForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        if (!name || !email || !password) {
            showToast('Please fill all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(newUser));
        currentUser = newUser;
        updateAuthUI();
        
        document.getElementById('regSuccessMessage').textContent = 'Registration successful!';
        document.getElementById('regSuccessMessage').style.display = 'block';
        
        setTimeout(() => {
            modal.style.display = 'none';
            showToast(`Welcome to MyFlix, ${name}!`);
        }, 1000);
        
        this.reset();
    });
    
    // Вход
    document.getElementById('loginForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('logEmail').value.trim();
        const password = document.getElementById('logPassword').value;
        
        if (!email || !password) {
            showToast('Please fill all fields', 'error');
            return;
        }
        
        const demoUser = {
            id: 1001,
            name: email.split('@')[0],
            email: email,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(demoUser));
        currentUser = demoUser;
        updateAuthUI();
        
        document.getElementById('logSuccessMessage').textContent = 'Login successful!';
        document.getElementById('logSuccessMessage').style.display = 'block';
        
        setTimeout(() => {
            modal.style.display = 'none';
            showToast(`Welcome back, ${demoUser.name}!`);
        }, 1000);
        
        this.reset();
    });
    
    // Выход
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
        localStorage.removeItem('user');
        currentUser = null;
        
        const signBtn = document.getElementById('openAccessModal');
        if (signBtn) {
            signBtn.textContent = 'Sign Up';
            signBtn.classList.remove('btn-success');
            signBtn.classList.add('btn-danger');
        }
        
        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
            profileBtn.style.display = 'none';
        }
        
        document.getElementById('profileModal').style.display = 'none';
        showToast('Logged out successfully!');
    });
});

// Экспорт функций
window.auth = {
    checkAuth,
    isAuthenticated: () => currentUser !== null,
    getCurrentUser: () => currentUser,
    showToast
};