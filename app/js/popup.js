const Popup = (function() {
    function create(message, options = {}) {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                if (options.type === 'confirm') {
                    if (options.onCancel) options.onCancel();
                } else if (options.onClose) {
                    options.onClose();
                }
            }
        });

        const box = document.createElement('div');
        box.className = 'popup';

        const text = document.createElement('p');
        text.textContent = message;
        box.appendChild(text);

        const buttons = document.createElement('div');
        buttons.className = 'popup-buttons';

        if (options.type === 'confirm') {
            const ok = document.createElement('button');
            ok.className = 'btn';
            ok.textContent = options.confirmText || 'OK';
            ok.addEventListener('click', () => {
                document.body.removeChild(overlay);
                if (options.onConfirm) options.onConfirm();
            });
            const cancel = document.createElement('button');
            cancel.className = 'btn btn-secondary';
            cancel.textContent = options.cancelText || 'Cancel';
            cancel.addEventListener('click', () => {
                document.body.removeChild(overlay);
                if (options.onCancel) options.onCancel();
            });
            buttons.appendChild(ok);
            buttons.appendChild(cancel);
        } else {
            const close = document.createElement('button');
            close.className = 'btn';
            close.textContent = options.okText || 'OK';
            close.addEventListener('click', () => {
                document.body.removeChild(overlay);
                if (options.onClose) options.onClose();
            });
            buttons.appendChild(close);
        }

        box.appendChild(buttons);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    function customPopup(html, options = {}) {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                if (options.onClose) options.onClose();
            }
        });

        const box = document.createElement('div');
        box.className = 'popup';

        const content = document.createElement('div');
        content.innerHTML = html;
        box.appendChild(content);

        const buttons = document.createElement('div');
        buttons.className = 'popup-buttons';

        const close = document.createElement('button');
        close.className = 'btn';
        close.textContent = options.closeText || 'Close';
        close.addEventListener('click', () => {
            document.body.removeChild(overlay);
            if (options.onClose) options.onClose();
        });

        buttons.appendChild(close);
        box.appendChild(buttons);

        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    return {
        alert(message) {
            create(message);
        },
        confirm(message, onConfirm, onCancel) {
            create(message, { type: 'confirm', onConfirm, onCancel });
        },
        custom(html, options) {
            customPopup(html, options);
        }
    };
})();

window.Popup = Popup;
