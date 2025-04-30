document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
  
    form.addEventListener("submit", function (e) {
      let isValid = true;
  
      // Clear previous error messages
      document.querySelectorAll(".error-message").forEach(msg => msg.innerText = "");
  
      const showError = (id, message) => {
        document.getElementById(id).innerText = message;
        isValid = false;
      };
  
      // Validate first name
      const firstName = document.getElementById("firstName");
      if (!/^[A-Za-z]{2,25}$/.test(firstName.value)) {
        showError("firstNameError", "Only letters (2–25 characters) allowed.");
        firstName.style.border = "2px solid red";
      } else {
        firstName.style.border = "2px solid green";
      }
  
      // Validate last name
      const lastName = document.getElementById("lastName");
      if (!/^[A-Za-z]{2,25}$/.test(lastName.value)) {
        showError("lastNameError", "Only letters (2–25 characters) allowed.");
        lastName.style.border = "2px solid red";
      } else {
        lastName.style.border = "2px solid green";
      }
  
      // Validate email
      const email = document.getElementById("email");
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value)) {
        showError("emailError", "Enter a valid email address.");
        email.style.border = "2px solid red";
      } else {
        email.style.border = "2px solid green";
      }
  
      // Validate phone number
      const phone = document.getElementById("phone");
      if (phone.value && !/^\d{7,15}$/.test(phone.value)) {
        showError("phoneError", "Phone number must be 7–15 digits.");
        phone.style.border = "2px solid red";
      } else {
        phone.style.border = phone.value ? "2px solid green" : "";
      }
  
      // Validate message
      const message = document.getElementById("message");
      if (message.value.trim() === "") {
        showError("messageError", "Message cannot be empty.");
        message.style.border = "2px solid red";
      } else {
        message.style.border = "2px solid green";
      }
  
      // Validate company name
      const company = document.getElementById("company");
      if (!/^[A-Za-z0-9\s]{2,50}$/.test(company.value.trim())) {
        showError("companyError", "Company name must be 2–50 characters, letters and numbers only.");
        company.style.border = "2px solid red";
      } else {
        company.style.border = "2px solid green";
      }
  
      // Validate checkbox "I'm not a robot"
      const notARobot = document.getElementById("notARobot");
      if (!notARobot.checked) {
        showError("robotError", "Please confirm you're not a robot.");
      }
  
      // If form is valid, send data to backend
      if (!isValid) {
        e.preventDefault();  // Prevent form submission if validation fails
      }
  
      // If form is valid, send data to backend
      if (isValid) {
        e.preventDefault(); // Prevent form submission to handle it with fetch
  
        const formData = {
          ask: document.getElementById("ask").value,
          subject: document.getElementById("subject").value,
          message: document.getElementById("message").value,
          title: document.getElementById("title").value,
          firstName: firstName.value,
          lastName: lastName.value,
          dob: document.getElementById("dob").value,
          gender: document.getElementById("gender").value,
          language: document.getElementById("language").value,
          country: document.getElementById("country").value,
          company: company.value,
          phone: phone.value,
          email: email.value,
          notARobot: notARobot.checked
        };
  
        fetch('http://localhost:3000/submit-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              // Show success message with user's email
              alert(`Success! Your form has been submitted successfully. Your email: ${data.email}`);
            }
          })
          .catch(error => {
            console.error('Error submitting form:', error);
          });
      }
    });
  
    // Handle message input for character count
    const messageField = document.getElementById("message");
    const note = document.querySelector(".note");
    messageField.addEventListener("input", () => {
      const remaining = 500 - messageField.value.length;
      note.textContent = `${remaining} characters remaining`;
    });
  });
  