/**
 * Lumina Sounds - Interaction JS
 */

document.addEventListener('DOMContentLoaded', () => {
    const allowedPortalOrigin = 'https://vinci.lumina-group.jp';
    const actions = {
        cloud: 'cloudRegistration',
        content: 'contentCheckout'
    };

    fetch('/music/storefront-config.json', { credentials: 'omit', cache: 'no-store' })
        .then(response => {
            if (!response.ok) throw new Error('storefront_config_unavailable');
            return response.json();
        })
        .then(config => {
            if (config.schemaVersion !== 1 || config.portalOrigin !== allowedPortalOrigin) {
                throw new Error('storefront_config_invalid');
            }
            document.querySelectorAll('[data-store-action]').forEach(element => {
                const action = element.dataset.storeAction;
                const feature = actions[action];
                const route = config.routes && config.routes[action];
                if (!feature || config.features?.[feature] !== true || typeof route !== 'string') {
                    return;
                }
                const destination = new URL(route, allowedPortalOrigin);
                if (destination.origin !== allowedPortalOrigin) return;
                element.href = destination.href;
                element.classList.remove('is-disabled');
                element.removeAttribute('aria-disabled');
                element.textContent = action === 'cloud' ? 'Vinci Cloudへ' : '商品を見る';
            });
            const status = document.querySelector('[data-store-status]');
            if (status && Object.values(config.features).some(value => value === true)) {
                status.textContent = 'STATUS / AVAILABLE SERVICES';
            }
        })
        .catch(() => {
            // Missing or malformed public config keeps every action disabled.
        });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('[data-ls-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Magnetic Button Effect (Refined to prevent jitter)
    const magneticBtns = document.querySelectorAll('.ls-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('click', event => {
            if (btn.getAttribute('aria-disabled') === 'true') event.preventDefault();
        });
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
});
