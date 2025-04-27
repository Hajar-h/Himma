class BrochureRequestForm {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        workEmail: document.getElementById('workEmail').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        companyName: document.getElementById('companyName').value,
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
      .then(response => response.text())
      .then(data => {
        alert(data);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error sending the form.');
      });
    });
  }
}