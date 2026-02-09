
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();

    const modal = document.getElementById('accessModal');
    const profileModal = document.getElementById('profileModal');
    const openButton = document.getElementById('openAccessModal');
    const closeButton = modal ? modal.querySelector('.close-button') : null;
    const closeProfileButton = document.getElementById('closeProfileModal');
    const registerPanel = document.getElementById('registerPanel');
    const loginPanel = document.getElementById('loginPanel');
    const showLoginLink = document.getElementById('showLogin');
    const showRegisterLink = document.getElementById('showRegister');
    const modalTitle = document.getElementById('modalAccessTitle');
    const logoutBtn = document.getElementById('logoutBtn');

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearAllMessages() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });

        const regSuccess = document.getElementById('regSuccessMessage');
        const logSuccess = document.getElementById('logSuccessMessage');
        if (regSuccess) regSuccess.style.display = 'none';
        if (logSuccess) logSuccess.style.display = 'none';
    }

    function openModal() {
        if (!modal) return;
        modal.style.display = 'flex';
        if (registerPanel) registerPanel.style.display = 'block';
        if (loginPanel) loginPanel.style.display = 'none';
        if (modalTitle) modalTitle.textContent = 'Register for MyFlix';
        const regForm = document.getElementById('registrationForm');
        const logForm = document.getElementById('loginForm');
        if (regForm) regForm.reset();
        if (logForm) logForm.reset();
        clearAllMessages();
    }

    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function openProfileModal() {
        if (!profileModal) return;
        const user = getCurrentUser();
        if (user) {
            document.getElementById('profileName').textContent = user.name || 'User';
            document.getElementById('profileEmail').textContent = user.email;
            document.getElementById('profileMemberSince').textContent = new Date(user.createdAt).toLocaleDateString();
            profileModal.style.display = 'flex';
        }
    }

    function closeProfileModal() {
        if (profileModal) {
            profileModal.style.display = 'none';
        }
    }

    if (openButton) {
        openButton.addEventListener('click', function() {
            if (isUserLoggedIn()) {
                openProfileModal();
            } else {
                openModal();
            }
        });
        
        updateAuthButton();
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    if (closeProfileButton) {
        closeProfileButton.addEventListener('click', closeProfileModal);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logoutUser();
            closeProfileModal();
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
        if (event.target === profileModal) {
            closeProfileModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (modal && modal.style.display === 'flex') {
                closeModal();
            }
            if (profileModal && profileModal.style.display === 'flex') {
                closeProfileModal();
            }
        }
    });

    function switchToLogin() {
        if (registerPanel) registerPanel.style.display = 'none';
        if (loginPanel) loginPanel.style.display = 'block';
        if (modalTitle) modalTitle.textContent = 'Welcome Back!';
        clearAllMessages();
    }

    function switchToRegister() {
        if (loginPanel) loginPanel.style.display = 'none';
        if (registerPanel) registerPanel.style.display = 'block';
        if (modalTitle) modalTitle.textContent = 'Register for MyFlix';
        clearAllMessages();
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchToLogin();
        });
    }
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchToRegister();
        });
    }

    function getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    function getUserByEmail(email) {
        const users = getUsers();
        return users.find(user => user.email === email);
    }

    function createUser(email, password) {
        const users = getUsers();
        
        if (getUserByEmail(email)) {
            return { success: false, message: 'User with this email already exists' };
        }
        
        const newUser = {
            id: Date.now().toString(),
            email: email,
            password: password,
            name: email.split('@')[0],
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        saveUsers(users);
        return { success: true, user: newUser };
    }

    function authenticateUser(email, password) {
        const user = getUserByEmail(email);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        if (user.password !== password) {
            return { success: false, message: 'Invalid password' };
        }
        
        return { success: true, user: user };
    }

    function setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    function getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    function logoutUser() {
        localStorage.removeItem('currentUser');
        updateAuthButton();
    }

    function isUserLoggedIn() {
        return getCurrentUser() !== null;
    }

    function updateAuthButton() {
        if (openButton) {
            if (isUserLoggedIn()) {
                openButton.textContent = 'Profile';
                openButton.classList.remove('btn-danger');
                openButton.classList.add('btn-success');
            } else {
                openButton.textContent = 'Sign Up';
                openButton.classList.remove('btn-success');
                openButton.classList.add('btn-danger');
            }
        }
    }

    function checkAuthStatus() {
        updateAuthButton();
    }

    const regForm = document.getElementById('registrationForm');
    if (regForm) {
        regForm.addEventListener('submit', function(event) {
            event.preventDefault();
            clearAllMessages();
            let isValid = true;

            const emailValue = document.getElementById('regEmail').value.trim();
            const passwordValue = document.getElementById('regPassword').value;
            const confirmPasswordValue = document.getElementById('regConfirmPassword').value;
            
            if (emailValue === '') {
                showError('regEmailError', 'Email is required.');
                isValid = false;
            } else if (!isValidEmail(emailValue)) {
                showError('regEmailError', 'Please enter a valid email format.');
                isValid = false;
            }

            if (passwordValue === '') {
                showError('regPasswordError', 'Password is required.');
                isValid = false;
            } else if (passwordValue.length < 8) {
                showError('regPasswordError', 'Password must be at least 8 characters long.');
                isValid = false;
            }

            if (confirmPasswordValue === '') {
                showError('regConfirmPasswordError', 'Confirm password is required.');
                isValid = false;
            } else if (confirmPasswordValue !== passwordValue) {
                showError('regConfirmPasswordError', 'Passwords do not match.');
                isValid = false;
            }

            if (isValid) {
                const result = createUser(emailValue, passwordValue);
                if (result.success) {
                    document.getElementById('regSuccessMessage').textContent = '✅ Registration Successful! Please proceed to Log In.';
                    document.getElementById('regSuccessMessage').style.display = 'block';
                    regForm.reset();
                    setTimeout(() => {
                        switchToLogin();
                    }, 1500);
                } else {
                    showError('regEmailError', result.message);
                }
            }
        });
    }

    const logForm = document.getElementById('loginForm');
    if (logForm) {
        logForm.addEventListener('submit', function(event) {
            event.preventDefault();
            clearAllMessages();
            let isValid = true;
            const emailValue = document.getElementById('logEmail').value.trim();
            const passwordValue = document.getElementById('logPassword').value;

            if (emailValue === '') {
                showError('logEmailError', 'Email is required.');
                isValid = false;
            } else if (!isValidEmail(emailValue)) {
                showError('logEmailError', 'Invalid email format.');
                isValid = false;
            }
            if (passwordValue === '') {
                showError('logPasswordError', 'Password is required.');
                isValid = false;
            }
            
            if (isValid) {
                const result = authenticateUser(emailValue, passwordValue);
                if (result.success) {
                    setCurrentUser(result.user);
                    document.getElementById('logSuccessMessage').textContent = '✅ Login Successful!';
                    document.getElementById('logSuccessMessage').style.display = 'block';
                    
                    setTimeout(() => {
                        closeModal();
                        updateAuthButton();
                    }, 1000);
                } else {
                    showError('logPasswordError', result.message);
                }
            }
        });
    }
});