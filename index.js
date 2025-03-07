
document.getElementById('sidebarToggle').addEventListener('click', function() {
    document.getElementById('customSidebar').classList.add('active');
  });

  document.getElementById('closeSidebar').addEventListener('click', function() {
    document.getElementById('customSidebar').classList.remove('active');
  });