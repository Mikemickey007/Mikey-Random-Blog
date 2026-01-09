document.getElementById("register").addEventListener("submit", validateRegister);
document.getElementById("clearBtn").addEventListener("click", clearForm);

function validateRegister(event) {
    event.preventDefault();

    let valid = true;
    let fullname = document.getElementById("fullname");
    let email = document.getElementById("email");
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let confirm = document.getElementById("confirm");
    let message = document.getElementById("message");
    let loader = document.getElementById("loading");

    clearErrors();
    message.textContent = "";

    if (fullname.value.trim() === "") {
        showError("nameError", "Full name is required", fullname);
        valid = false;
    }

    if (!email.value.includes("@")) {
        showError("emailError", "Please enter a valid email", email);
        valid = false;
    }

    if (username.value.length < 3) {
        showError("usernameError", "Username must be at least 3 characters", username);
        valid = false;
    }

    if (password.value.length < 6) {
        showError("passwordError", "Password must be at least 6 characters", password);
        valid = false;
    }

    if (password.value !== confirm.value) {
        showError("confirmError", "Passwords do not match", confirm);
        valid = false;
    }

    if (valid) {
        loader.classList.remove('hidden');

        setTimeout(() => {
            loader.classList.add('hidden');

            message.textContent = "Registration successful! Welcome to the community.";
            message.style.color = "var(--color-success)";
            message.style.fontWeight = "bold";

            document.querySelector("button[type='submit']").disabled = true;
            document.querySelector("button[type='submit']").style.opacity = "0.5";
        }, 1000);
    }
}

function showError(errorId, text, input) {
    let error = document.getElementById(errorId);
    error.textContent = text;
    error.style.color = "var(--color-error)";
    input.style.borderColor = "var(--color-error)";
}

function clearErrors() {
    let errorIds = ["nameError", "emailError", "usernameError", "passwordError", "confirmError"];
    errorIds.forEach(id => {
        document.getElementById(id).textContent = "";
    });
    let inputs = document.querySelectorAll("#register input");
    inputs.forEach(input => input.style.borderColor = "");
}

function clearForm() {
    document.getElementById("register").reset();
    clearErrors();
    document.getElementById("message").textContent = "";

    document.querySelector("button[type='submit']").disabled = false;
    document.querySelector("button[type='submit']").style.opacity = "1";
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
    const regForm = document.getElementById("register");
    const clearStorageBtn = document.getElementById("clearStorageBtn");

    const inputs = regForm.querySelectorAll('input[type="text"], input[type="email"]');

    loadData();

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            saveData();
            showSavedToast(input);
        });
    });

    if (clearStorageBtn) {
        clearStorageBtn.addEventListener('click', () => {
            clearPreference();
        });
    }

    regForm.addEventListener("submit", validateRegister);
    document.getElementById("clearBtn").addEventListener("click", clearForm);
});


function saveData() {
    const regForm = document.getElementById("register");
    const inputs = regForm.querySelectorAll('input[type="text"], input[type="email"]');

    let formData = {};
    inputs.forEach(input => {
        formData[input.id] = input.value;
    });

    localStorage.setItem('registerDraft', JSON.stringify(formData));
}

function loadData() {
    const savedData = localStorage.getItem('registerDraft');
    if (savedData) {
        const data = JSON.parse(savedData);

        Object.keys(data).forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.value = data[id];
            }
        });
    }
}

function clearPreference() {
    if (confirm("Clear all auto-saved data?")) {
        localStorage.removeItem('registerDraft');
        document.getElementById("register").reset();
        alert("Registration cache cleared!");
    }
}

function showSavedToast(element) {
    let toast = element.parentNode.querySelector('.save-toast-reg');
    if (!toast) {
        toast = document.createElement('span');
        toast.className = 'save-toast-reg';
        toast.style = "font-size: 0.7rem; color: #16a34a; margin-left: 10px; font-weight: bold; transition: opacity 0.3s;";
        element.parentNode.insertBefore(toast, element.nextSibling);
    }
    toast.textContent = "Saved!";
    toast.style.opacity = "1";
    setTimeout(() => { toast.style.opacity = "0"; }, 800);
}