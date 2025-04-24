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

    // PDF Viewer
    const urlParams = new URLSearchParams(window.location.search);
    const file = urlParams.get('file');
    const pdfCanvas = document.getElementById('pdf-canvas');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNum = document.getElementById('page-num');
    const downloadBtn = document.getElementById('download-btn');

    if (pdfCanvas && file) {
        let pdfDoc = null;
        let pageNumVal = 1;
        let pageIsRendering = false;
        let pageNumPending = null;

        const scale = 1.5;
        const canvas = pdfCanvas;
        const ctx = canvas.getContext('2d');

        const renderPage = (num) => {
            pageIsRendering = true;

            pdfDoc.getPage(num).then((page) => {
                const viewport = page.getViewport({ scale });
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderCtx = {
                    canvasContext: ctx,
                    viewport: viewport,
                };

                page.render(renderCtx).promise.then(() => {
                    pageIsRendering = false;
                    if (pageNumPending !== null) {
                        renderPage(pageNumPending);
                        pageNumPending = null;
                    }
                });

                pageNum.textContent = `Сторінка ${num} з ${pdfDoc.numPages}`;
            });
        };

        const queueRenderPage = (num) => {
            if (pageIsRendering) {
                pageNumPending = num;
            } else {
                renderPage(num);
            }
        };

        pdfjsLib.getDocument(`/pdf/${file}`).promise.then((pdf) => {
            pdfDoc = pdf;
            renderPage(pageNumVal);
            downloadBtn.href = `/pdf/${file}`;
        }).catch((err) => {
            console.error('Error loading PDF:', err);
            pageNum.textContent = 'Помилка завантаження PDF';
        });

        prevPageBtn.addEventListener('click', () => {
            if (pageNumVal <= 1) return;
            pageNumVal--;
            queueRenderPage(pageNumVal);
        });

        nextPageBtn.addEventListener('click', () => {
            if (pageNumVal >= pdfDoc.numPages) return;
            pageNumVal++;
            queueRenderPage(pageNumVal);
        });
    }
});