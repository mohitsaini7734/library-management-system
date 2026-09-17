document.addEventListener('DOMContentLoaded', () => {
  const dueDate = document.getElementById('dueDate');
  if (dueDate && !dueDate.value) {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    dueDate.value = local.toISOString().split('T')[0];
    dueDate.min = new Date().toISOString().split('T')[0];
  }
  document.querySelectorAll('.alert').forEach(el => setTimeout(() => el.classList.add('hide'), 4500));
});
