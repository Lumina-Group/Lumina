/**
 * Scroll Module
 * ナビゲーションバーのスクロール効果とスムーススクロール機能を管理
 */

/**
 * スクロールイベントをスロットルする（パフォーマンス最適化）
 * @param {Function} func - 実行する関数
 * @param {number} wait - 待機時間（ミリ秒）
 * @returns {Function} スロットルされた関数
 */
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * ナビゲーションバーのスクロール効果を初期化
 */
export function initNavbarScroll() {
    try {
        const navbar = document.querySelector('.navbar');
        if (!navbar) {
            return;
        }

        const handleScroll = throttle(() => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 10); // 10msごとに実行

        window.addEventListener('scroll', handleScroll, { passive: true });
    } catch (error) {
        console.error('Error initializing navbar scroll:', error);
    }
}

/**
 * アンカーリンクのスムーススクロール機能を初期化
 */
export function initSmoothScroll() {
    try {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        if (anchorLinks.length === 0) {
            return;
        }

        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                // 空のアンカー（#のみ）の場合はデフォルト動作を許可
                if (href === '#' || href === '') {
                    return;
                }

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error initializing smooth scroll:', error);
    }
}

