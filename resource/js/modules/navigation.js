/**
 * Navigation Module
 * モバイルメニューのトグル、ナビゲーションリンクの処理、アクティブページのハイライトを管理
 */

/**
 * モバイルメニューのトグル機能を初期化
 */
export function initMobileMenu() {
    try {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const navLinks = document.querySelectorAll('.nav-item a');

        if (!navbarToggler || !navbarCollapse) {
            return;
        }

        // トグルボタンのクリック処理
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('active');
            navbarToggler.classList.toggle('active');
            const isExpanded = navbarCollapse.classList.contains('active');
            navbarToggler.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });

        // メニュー外のクリックでメニューを閉じる
        document.addEventListener('click', (e) => {
            if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                closeMobileMenu(navbarToggler, navbarCollapse);
            }
        });

        // ナビゲーションリンクのクリックでメニューを閉じる
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu(navbarToggler, navbarCollapse);
            });
        });
    } catch (error) {
        console.error('Error initializing mobile menu:', error);
    }
}

/**
 * モバイルメニューを閉じる
 * @param {HTMLElement} navbarToggler - トグルボタン要素
 * @param {HTMLElement} navbarCollapse - メニュー要素
 */
function closeMobileMenu(navbarToggler, navbarCollapse) {
    navbarCollapse.classList.remove('active');
    navbarToggler.classList.remove('active');
    navbarToggler.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

/**
 * パスを正規化する（末尾のスラッシュを削除）
 * @param {string} path - 正規化するパス
 * @returns {string} 正規化されたパス
 */
function normalizePath(path) {
    if (!path) return '/';
    const withoutTrailingSlash = path.replace(/\/+$/, '');
    return withoutTrailingSlash === '' ? '/' : withoutTrailingSlash;
}

/**
 * 現在のページに対応するナビゲーションリンクにアクティブクラスを追加
 */
export function setActiveNavLink() {
    try {
        const navLinks = document.querySelectorAll('.nav-item a');
        if (navLinks.length === 0) {
            return;
        }

        const currentPath = normalizePath(window.location.pathname);

        navLinks.forEach(link => {
            try {
                const linkPath = normalizePath(new URL(link.getAttribute('href'), window.location.origin).pathname);
                if (linkPath === currentPath) {
                    link.classList.add('active');
                }
            } catch (error) {
                // 相対パスの場合など、URLの解析に失敗する可能性がある
                console.warn('Could not parse link href:', link.getAttribute('href'));
            }
        });
    } catch (error) {
        console.error('Error setting active nav link:', error);
    }
}

