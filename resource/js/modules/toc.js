/**
 * Table of Contents Module
 * ニュース記事の目次を自動生成
 */

/**
 * 目次を生成する
 */
export function generateTOC() {
    try {
        const newsArticle = document.querySelector('.news-article');
        if (!newsArticle) {
            return;
        }

        const tocContainer = document.getElementById('toc');
        if (!tocContainer) {
            return;
        }

        const contentDiv = document.querySelector('.news-body');
        if (!contentDiv) {
            tocContainer.style.display = 'none';
            return;
        }

        const headings = contentDiv.querySelectorAll('h2, h3, h4, h5, h6');
        if (headings.length === 0) {
            tocContainer.style.display = 'none';
            return;
        }

        let tocHtml = '<h3>目次</h3><ul>';
        headings.forEach((heading, index) => {
            const id = `section-${index}`;
            heading.setAttribute('id', id);
            const level = parseInt(heading.tagName.substring(1));
            const text = heading.textContent.trim();
            tocHtml += `<li class="toc-level-${level}"><a href="#${id}">${text}</a></li>`;
        });
        tocHtml += '</ul>';
        tocContainer.innerHTML = tocHtml;
    } catch (error) {
        console.error('Error generating table of contents:', error);
    }
}

/**
 * ページ読み込み時に目次を生成
 */
export function initTOC() {
    // window.onloadを使用して、すべてのコンテンツが読み込まれた後に実行
    if (document.readyState === 'complete') {
        generateTOC();
    } else {
        window.addEventListener('load', generateTOC);
    }
}

