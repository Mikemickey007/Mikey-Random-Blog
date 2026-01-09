document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", validateLogin);

    document.getElementById("username").oninput = clearUsernameError;
    document.getElementById("password").oninput = clearPasswordError;
});

function validateLogin(event) {
    event.preventDefault();

    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let userError = document.getElementById("usernameError");
    let passError = document.getElementById("passwordError");
    let loader = document.getElementById("loading"); // Grab the loader element

    let valid = true;

    userError.textContent = "";
    passError.textContent = "";
    username.style.borderColor = "";
    password.style.borderColor = "";

    if (username.value === "") {
        showError(userError, username, "Email cannot be empty");
        valid = false;
    } else if (!username.value.includes("@")) {
        showError(userError, username, "Email must include @");
        valid = false;
    }

    if (password.value === "") {
        showError(passError, password, "Password cannot be empty");
        valid = false;
    } else if (password.value.length < 6) {
        showError(passError, password, "Password must be at least 6 characters");
        valid = false;
    }

    if (valid) {
        loader.classList.remove('hidden');

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    }
}

function showError(errorElement, inputElement, message) {
    errorElement.textContent = message;
    errorElement.style.color = "var(--color-error)";
    inputElement.style.borderColor = "var(--color-error)";
}

function clearUsernameError() {
    document.getElementById("username").style.borderColor = "";
    document.getElementById("usernameError").textContent = "";
}

function clearPasswordError() {
    document.getElementById("password").style.borderColor = "";
    document.getElementById("passwordError").textContent = "";
}

function savePreference(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function loadPreference(key) {
    return JSON.parse(localStorage.getItem(key));
}

window.onload = function () {
    const darkMode = loadPreference("darkMode");

    if (darkMode) {
        document.body.classList.add("dark");
        const toggle = document.getElementById("darkToggle");
        if (toggle) toggle.checked = true;
    }

    const toggle = document.getElementById("darkToggle");
    if (toggle) {
        toggle.addEventListener("change", function () {
            document.body.classList.toggle("dark");
            savePreference("darkMode", toggle.checked);
        });
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const clearStorageBtn = document.getElementById("clearStorageBtn");

    loadData();

    usernameInput.addEventListener('input', () => {
        saveData();
        showSavedToast(usernameInput);
    });

    if (clearStorageBtn) {
        clearStorageBtn.addEventListener('click', () => {
            clearPreference();
        });
    }

    loginForm.addEventListener("submit", validateLogin);
    usernameInput.oninput = clearUsernameError;
});


function saveData() {
    const username = document.getElementById("username").value;
    const loginData = { username: username };
    localStorage.setItem('loginDraft', JSON.stringify(loginData));
}

function loadData() {
    const savedData = localStorage.getItem('loginDraft');
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById("username").value = data.username || "";
    }
}

function clearPreference() {
    localStorage.removeItem('loginDraft');
    document.getElementById("loginForm").reset();
    alert("Login cache cleared!");
}

function showSavedToast(element) {
    let toast = document.getElementById('save-toast-login');
    if (!toast) {
        toast = document.createElement('span');
        toast.id = 'save-toast-login';
        toast.style = "font-size: 0.7rem; color: #16a34a; margin-left: 10px; font-weight: bold; transition: opacity 0.3s;";
        element.parentNode.appendChild(toast);
    }
    toast.textContent = "Saved!";
    toast.style.opacity = "1";
    setTimeout(() => { toast.style.opacity = "0"; }, 800);
}

localStorage.setItem("loggedInUser", "101");

