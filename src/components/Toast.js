// Toast Notification Component

export function showToast(message, type = 'info') {
  let toast = document.getElementById('toast-container');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-container';
    toast.className = 'toast-msg font-silkscreen';
    document.body.appendChild(toast);
  }

  const icon = type === 'success' ? '✨' : type === 'warning' ? '⚠️' : '🎃';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toast.classList.add('show');

  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }

  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
