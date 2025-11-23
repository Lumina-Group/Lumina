/**
 * Main Entry Point
 * 各モジュールをインポートして初期化
 */

import { initMobileMenu, setActiveNavLink } from './modules/navigation.js';
import { initNavbarScroll, initSmoothScroll } from './modules/scroll.js';
import { initTOC } from './modules/toc.js';
import { initLazyLoad } from './modules/lazy-load.js';

/**
 * アプリケーションを初期化
 */
function init() {
    // ナビゲーション機能
    initMobileMenu();
    setActiveNavLink();

    // スクロール機能
    initNavbarScroll();
    initSmoothScroll();

    // 目次生成
    initTOC();

    // 画像遅延読み込み
    initLazyLoad();
}

// DOMContentLoadedイベントで初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOMContentLoadedが既に発火している場合は即座に実行
    init();
}
