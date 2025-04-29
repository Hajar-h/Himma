document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('brochureForm');



  form.addEventListener('submit', (e) => {
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


  const email = document.getElementById("workEmail");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
      showError("emailError", "Enter a valid email address.");
      email.style.border = "2px solid red";
  } else {
      email.style.border = "2px solid green";
  }


  const phone = document.getElementById("phoneNumber");
  if (phone.value && !/^\d{7,15}$/.test(phone.value)) {
      showError("phoneError", "Phone must be 7–15 digits.");
      phone.style.border = "2px solid red";
  } else {
      phone.style.border = phone.value ? "2px solid green" : "";
  }


  const company = document.getElementById("companyName");
  if (!/^[A-Za-z0-9\s]{2,50}$/.test(company.value.trim())) {
      showError("companyError", "Company name must be 2–50 characters, letters and numbers only.");
      company.style.border = "2px solid red";
  } else {
      company.style.border = "2px solid green";
  }


        
  if (!isValid) {
     e.preventDefault();
        return;
  }



  e.preventDefault();
    
    const formData = {
      firstName: firstName.value,
      lastName: lastName.value,
      workEmail: email.value,
      phoneNumber: phone.value,
      companyName: company.value,
      role: document.getElementById('role').value,
      brochure: document.getElementById('brochure').value
    };

    fetch('http://localhost:3000/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Received data:', data); 
      document.getElementById('userName').textContent = data.firstName + ' ' + data.lastName;
      document.getElementById('downloadLink').href = data.brochureUrl; 
      document.getElementById('confirmationMessage').style.display = 'block';
      alert('Your data has been successfully submitted! You can download your brochure now.');

    })
    .catch(error => {
      console.error('Error:', error);
      alert('There was an error processing your request. Please try again.');

    });
  });
});

