document.addEventListener("DOMContentLoaded", function () {
    const users = []; // This array will store user data

    // Get DOM elements
    const logoutButton = document.getElementById("logout");
    const userDataBlock = document.getElementById("user_data");
    const toggleBlock = document.getElementById("toggle");
    const loginBlock = document.getElementById("login_block");
    const registerBlock = document.getElementById("register_block");
    const forgotPasswordButton = document.getElementById("forgot_password");
    const forgotPasswordBlock = document.getElementById("forgot_password_block");
    const loginToggleBtn = document.getElementById("login_toggle_button");
    const registerToggleBtn = document.getElementById("register_toggle_button");

    // Event listeners for toggle buttons
    loginToggleBtn.addEventListener("click", function () {
        showBlock(loginBlock, loginToggleBtn);
        hideBlock(registerBlock, registerToggleBtn);
        registerToggleBtn.style.background = "none";
    });

    registerToggleBtn.addEventListener("click", function () {
        showBlock(registerBlock, registerToggleBtn);
        hideBlock(loginBlock, loginToggleBtn);
        loginToggleBtn.style.background = "none";
    });

    logoutButton.addEventListener("click", function () {
        showBlock(loginBlock, loginToggleBtn);
        showBlock(toggleBlock, loginToggleBtn);
        hideBlock(userDataBlock);
        hideBlock(registerBlock);
    });

    forgotPasswordButton.addEventListener("click", function () {
        hideBlock(toggleBlock);
        hideBlock(loginBlock);
        hideBlock(registerBlock);
        showBlock(forgotPasswordBlock);
    });

    // Function to show user data
    function showUserData(userData) {
        const { firstName, lastName, email, username, password } = userData;
        document.getElementById("name").textContent = `${firstName} ${lastName}`;
        document.getElementById("user_email").textContent = email;
        document.getElementById("username").textContent = username;
        document.getElementById("password").textContent = password;
        hideBlock(loginBlock);
        hideBlock(registerBlock);
        hideBlock(forgotPasswordBlock);
        hideBlock(toggleBlock);
        userDataBlock.style.display = "block";
    }

    // Event listener for user registration
    document.getElementById("submit_register").addEventListener("click", async function () {
        const firstName = document.getElementById("first_name").value;
        const lastName = document.getElementById("last_name").value;
        const email = document.getElementById("email").value;
        const username = document.getElementById("reg_username").value;
        const password = document.getElementById("reg_password").value;
        const confirm_password = document.getElementById("confirm_password").value;

        if (password === confirm_password) {
            try {
                const encoder = new TextEncoder();
                const data = encoder.encode(password);

                const hashBuffer = await crypto.subtle.digest("SHA-256", data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashedPassword = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

                const newUser = {
                    firstName,
                    lastName,
                    email,
                    username,
                    password: hashedPassword // Store hashed password
                };

                users.push(newUser); // Add user to the array
                alert("New user registered...");
                
                loginBlock.style.display = "block";
                loginToggleBtn.style.backgroundColor = "#91C1D9";
                registerBlock.style.display = "none";
                registerToggleBtn.style.backgroundColor = "transparent";
            } catch (error) {
                console.error("Error hashing password:", error);
            }
        } else {
            alert("Password not same!");
        }
    });

    // Event listener for user login
    document.getElementById("submit_login").addEventListener("click", async function () {
        const username = document.getElementById("login_username").value;
        const password = document.getElementById("login_password").value;

        const user = users.find(u => u.username === username);

        if (user) {
            try {
                const encoder = new TextEncoder();
                const data = encoder.encode(password);

                const hashBuffer = await crypto.subtle.digest("SHA-256", data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashedPassword = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

                if (hashedPassword === user.password) {
                    showUserData(user);
                } else {
                    alert("Login failed. Invalid credentials.");
                }
            } catch (error) {
                alert("Error comparing passwords:", error);
            }
        } else {
            alert("Login failed. User not found.");
        }
    });

    // Event listener for password reset
    document.getElementById("submit_forgot_password").addEventListener("click", async function () {
        const email = document.getElementById("forgot_email").value;
        const username = document.getElementById("forgot_username").value;
        const newPassword = document.getElementById("new_password").value;
        const confirm_new_password = document.getElementById("confirm_new_password").value;

        const user = users.find(u => u.username === username && u.email === email);

        if (user) {
            if (newPassword === confirm_new_password) {
                try {
                    const encoder = new TextEncoder();
                    const data = encoder.encode(newPassword);

                    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashedPassword = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

                    user.password = hashedPassword;
                    alert("Password reset successful...");
                    loginBlock.style.display = "block";
                    toggleBlock.style.display = "block";
                    forgotPasswordBlock.style.display = "none";
                } catch (error) {
                    console.error("Error hashing password:", error);
                }
            } else {
                alert("Password not same!");
            }
        } else {
            alert("Password reset failed. User not found.");
        }
    });

    // Helper functions to show/hide blocks
    function showBlock(block, toggleButton) {
        block.style.display = "block";
        toggleButton.style.backgroundColor = "#91C1D9";
    }

    function hideBlock(block) {
        block.style.display = "none";
    }
});

