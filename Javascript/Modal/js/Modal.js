class Modal extends HTMLElement {

	connectedCallback() {
		const id = this.getAttribute('id').replace('#', '');
		const openButtons = document.querySelectorAll(`[data-modal-popup="${id}"]`);
		const cantClosePopup = (
			this.getAttribute('cant-close') !== null
		);
		const noCloseButton = (
			this.getAttribute('no-close-button') !== null
		);
		const activeByDefault = (
			this.getAttribute('active') !== null
		);
		const showCloseButton = () => {
			if (noCloseButton) return false;
			return !cantClosePopup;
		};

		// Set accessibility attributes for the buttons that open the modal
		openButtons.forEach(openButton => {
			openButton.setAttribute('aria-haspopup', `dialog`);
			openButton.setAttribute('aria-controls', `modal-${id}`);
			openButton.setAttribute('tabindex', '0');
			openButton.setAttribute('role', 'button');
		});

		// Set accessibility attributes for the modal
		this.setAttribute('aria-labelledby', `modal-${id}`);
		this.setAttribute('role', 'dialog');
		this.setAttribute('aria-modal', 'true');
		this.setAttribute('aria-hidden', 'true');
		this.setAttribute('tabindex', '-1');

		this.addTriggersEvents(id);

		if (showCloseButton()) this.addCloseButton();

		// Wrap inner HTML in a role document div for accessibility use
		this.innerHTML = `<div role="document" hidden="true">${this.innerHTML}</div>`;

		if (activeByDefault) this.open();

		// Inner focusable elements of the modal shouldn't be tabbable
		this.querySelectorAll(this.getFocusableElements()).forEach($focusableElement => $focusableElement.setAttribute('tabindex', '-1'));
	}

	/**
	 * Add a close button
	 */
	addCloseButton() {
		let button = `
            <button
                type="button"
                aria-label="Close"
                title="Close"
                data-dismiss="dialog"
            >
               <span></span>
               <span></span>
            </button>
        `;

		this.innerHTML = button + this.innerHTML;
	}

	/**
	 * Get an array of the focusable elements
	 *
	 * @returns {string[]}
	 */
	getFocusableElements() {
		return [
			'[href]',
			'button:not([disabled])',
			'input:not([disabled])',
			'select:not([disabled])',
			'textarea:not([disabled])',
			'[tabindex]:not([tabindex="-1"])'
		];
	}

	/**
	 * Add all events listeners
	 */
	addTriggersEvents(modalID) {
		document.addEventListener('DOMContentLoaded', () => {
			const triggers = document.querySelectorAll(`[aria-controls="modal-${modalID}"]`);

			// On button click or Enter press, open the modal
			if (triggers) {
				triggers.forEach(trigger => {
					// Handle click
					trigger.addEventListener('click', e => {
						e.preventDefault();
						this.open(trigger);
					});

					// Handle Enter key
					trigger.addEventListener('keypress', e => {
						if (e.code !== 'Enter') return;
						e.preventDefault();
						this.open(trigger);
					});
				});
			}
		});
	}

	/**
	 * When modal is open, we should focus elements inner
	 */
	focusModal() {
		const focusableElementsArray = this.getFocusableElements();
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
		if (dismissDialog) {
			dismissDialog.addEventListener('click', e => {
				e.preventDefault();
				this.close(trigger);
			});
		}

		// On backdrop click
		this.addEventListener('mousedown', e => {
			if (e.target === this) this.close(trigger);
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

		this.querySelectorAll(this.getFocusableElements()).forEach($focusableElement => $focusableElement.setAttribute('tabindex', '0'));

		this.focusModal();
		this.addModalEvents(trigger);

		// Emit event
		this.dispatchEvent(new Event('modalOpen'));
	}

	/**
	 * Close the modal
	 */
	close(trigger) {
		if (this.getAttribute('cant-close') !== null) return;

		this.querySelector('[role="document"]').setAttribute('hidden', 'true');
		this.setAttribute('aria-hidden', 'true');
		this.classList.remove('is-active');

		this.querySelectorAll(this.getFocusableElements()).forEach($focusableElement => $focusableElement.setAttribute('tabindex', '-1'));

		// Restoring focus
		if (trigger) trigger.focus();

		// Emit event
		this.dispatchEvent(new Event('modalClose'));
	}

}

customElements.define('modal-popup', Modal);
