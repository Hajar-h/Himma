document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (e) {
        let isValid = true;


        document.querySelectorAll(".error-message").forEach(msg => msg.innerText = "");


        const showError = (id, message) => {
            document.getElementById(id).innerText = message;
            isValid = false;
        };

        const firstName = document.getElementById("firstName");
        if (!/^[A-Za-z]{2,25}$/.test(firstName.value)) {
            showError("firstNameError", "Only letters (2–25 characters) allowed.");
            firstName.style.border = "2px solid red";
        } else {
            firstName.style.border = "2px solid green";
        }


        const lastName = document.getElementById("lastName");
        if (!/^[A-Za-z]{2,25}$/.test(lastName.value)) {
            showError("lastNameError", "Only letters (2–25 characters) allowed.");
            lastName.style.border = "2px solid red";
        } else {
            lastName.style.border = "2px solid green";
        }

        const email = document.getElementById("email");
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            showError("emailError", "Enter a valid email address.");
            email.style.border = "2px solid red";
        } else {
            email.style.border = "2px solid green";
        }


        const phone = document.getElementById("phone");
        if (phone.value && !/^\d{7,15}$/.test(phone.value)) {
            showError("phoneError", "Phone must be 7–15 digits.");
            phone.style.border = "2px solid red";
        } else {
            phone.style.border = phone.value ? "2px solid green" : "";
        }

        const message = document.getElementById("message");
        if (message.value.trim() === "") {
            showError("messageError", "Message cannot be empty.");
            message.style.border = "2px solid red";
        } else {
            message.style.border = "2px solid green";
        }


        const notARobot = document.getElementById("notARobot");
        if (!notARobot.checked) {
            showError("robotError", "Please confirm you're not a robot.");
        }


        if (!isValid) {
            e.preventDefault();
        }
    });


    const messageField = document.getElementById("message");
    const note = document.querySelector(".note");
    messageField.addEventListener("input", () => {
        const remaining = 500 - messageField.value.length;
        note.textContent = `${remaining} characters remaining`;
    });
});
