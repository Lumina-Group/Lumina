/**
 * Lazy Load Module
 * IntersectionObserverを使用した画像の遅延読み込み
 */

/**
 * 画像の遅延読み込みを初期化
 */
export function initLazyLoad() {
    try {
        // IntersectionObserverがサポートされていない場合は終了
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver is not supported. Falling back to immediate image loading.');
            // フォールバック: すべての画像を即座に読み込む
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
            return;
        }

        const images = document.querySelectorAll('img[data-src]');
        if (images.length === 0) {
            return;
        }

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            // 画像がビューポートに入る少し前に読み込みを開始
            rootMargin: '50px'
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    } catch (error) {
        console.error('Error initializing lazy load:', error);
    }
}

