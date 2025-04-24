document.addEventListener('DOMContentLoaded', () => {
    // GSAP Animations
    gsap.from('.card', { opacity: 0, y: 50, stagger: 0.2, duration: 1, ease: 'power3.out' });
    gsap.from('nav', { y: -50, opacity: 0, duration: 1, ease: 'power3.out' });

    // Ripple Effect on Click
    document.body.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1000);
    });

    // Upload Functionality
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-upload');
    const uploadStatus = document.getElementById('upload-status');

    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => {
            if (fileInput.files.length > 0) {
                uploadStatus.textContent = 'Файл успішно завантажено!';
                uploadStatus.classList.add('text-green-400');
            } else {
                uploadStatus.textContent = 'Будь ласка, виберіть файл!';
                uploadStatus.classList.add('text-red-400');
            }
        });
    }

    // PDF Viewer (iframe)
    const urlParams = new URLSearchParams(window.location.search);
    const file = urlParams.get('file');
    const pdfViewer = document.getElementById('pdf-viewer');
    const downloadBtn = document.getElementById('download-btn');

    if (pdfViewer && file) {
        pdfViewer.src = file;
        // Встановлюємо URL для скачування
        downloadBtn.href = file.replace('/preview', '').replace('file/d/', 'uc?export=download&id=');
    }
});