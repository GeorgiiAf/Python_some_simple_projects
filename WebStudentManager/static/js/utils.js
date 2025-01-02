export function showLoader() {
    document.body.style.cursor = 'wait';
}

export function hideLoader() {
    document.body.style.cursor = 'default';
}

export function closeModal() {
    const modal = document.getElementById('student-modal');
    if (modal) {
        // Используем Bootstrap Modal API
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
            bsModal.hide();
        }
        
        // Очищаем форму
        const form = modal.querySelector('.grade-form');
        if (form) {
            form.reset();
        }

        // Удаляем затемненный фон
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }
}
