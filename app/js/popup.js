const Popup = (function() {
    function create(message, options = {}) {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';

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

    return {
        alert(message) {
            create(message);
        },
        confirm(message, onConfirm, onCancel) {
            create(message, { type: 'confirm', onConfirm, onCancel });
        }
    };
})();

window.Popup = Popup;
