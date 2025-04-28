document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('brochureForm');
  form.addEventListener('submit', (e) => {
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
