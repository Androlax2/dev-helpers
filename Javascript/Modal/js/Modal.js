class Modal extends HTMLElement {

    connectedCallback() {
        const id = this.getAttribute('id').replace('#', '');
        const openButtons = document.querySelectorAll(`[data-modal-popup="${id}"]`);

        // Set accessibility attributes for the buttons that open the modal
        openButtons.forEach(openButton => {
            openButton.setAttribute('aria-haspopup', `dialog`);
            openButton.setAttribute('aria-controls', `modal-${id}`);
        });

        // Set accessibility attributes for the modal
        this.setAttribute('aria-labelledby', `modal-${id}`);
        this.setAttribute('role', 'dialog');
        this.setAttribute('aria-modal', 'true');
        this.setAttribute('aria-hidden', 'true');
        this.setAttribute('tabindex', '-1');

        this.addTriggersEvents(id);

        this.addCloseButton();

        // Wrap inner HTML in a role document div for accessibility use
        this.innerHTML = `<div role="document" hidden="true">${this.innerHTML}</div>`;
    }

    /**
     * Add a close button
     */
    addCloseButton() {
        let button = `
            <button 
                type="button"
                aria-label="Close"
                title="Close this modal box"
                data-dismiss="dialog"
            >
               <span></span>
               <span></span>
            </button>
        `;

        this.innerHTML = button + this.innerHTML;
    }

    /**
     * Add all events listeners
     */
    addTriggersEvents(modalID) {
        document.addEventListener('DOMContentLoaded', () => {
            const triggers = document.querySelectorAll(`[aria-controls="modal-${modalID}"]`);

            // On button click, open the modal
            triggers.forEach(trigger => {
                trigger.addEventListener('click', e => {
                    e.preventDefault();
                    this.open(trigger);
                });
            });
        });
    }

    /**
     * When modal is open, we should focus elements inner
     */
    focusModal() {
        const focusableElementsArray = [
            '[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
        ];
        const focusableElements = this.querySelectorAll(focusableElementsArray);
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        if (!firstFocusableElement) return;
        window.setTimeout(() => {
            firstFocusableElement.focus();

            // Trapping focus inside the dialog
            focusableElements.forEach(focusableElement => {
                if (focusableElement.addEventListener) {
                    focusableElement.addEventListener('keydown', e => {
                        const tab = e.key === 'Tab';
                        if (!tab) return;

                        if (e.shiftKey) {
                            if (e.target === firstFocusableElement) { // Shift + Tab
                                e.preventDefault();
                                lastFocusableElement.focus();
                            }
                        } else if (e.target === lastFocusableElement) { // Tab
                            e.preventDefault();
                            firstFocusableElement.focus();
                        }
                    });
                }
            });
        }, 100);
    }

    /**
     * Add modal events, when modal is focused
     */
    addModalEvents(trigger) {
        // Close modal with button
        const dismissDialog = this.querySelector('[data-dismiss]');
        dismissDialog.addEventListener('click', e => {
            e.preventDefault();
            this.close();
        });

        // On backdrop click
        this.addEventListener('click', e => {
            if (e.target === this) this.close();
        });

        // When pressing ESC, close the modal
        this.addEventListener('keyup', e => {
            if (e.key === 'Escape') this.close(trigger);
        });
    }

    /**
     * Open the modal
     */
    open(trigger) {
        this.querySelector('[role="document"]').removeAttribute('hidden');
        this.setAttribute('aria-hidden', 'false');
        this.classList.add('is-active');

        this.focusModal();
        this.addModalEvents(trigger);
    }

    /**
     * Close the modal
     */
    close(trigger) {
        this.querySelector('[role="document"]').setAttribute('hidden', 'true');
        this.setAttribute('aria-hidden', 'true');
        this.classList.remove('is-active');

        // Restoring focus
        if (trigger) trigger.focus();
    }

}

customElements.define('modal-popup', Modal);