/**
 * Call callback function after a certain delay
 *
 * @param callback
 * @param delay
 * @returns {function(...[*]=)}
 */
const debounce = (callback, delay) => {
    let timer;
    return function () {
        let args = arguments,
            context = this;

        clearTimeout(timer);
        timer = setTimeout(() => callback.apply(context, args), delay);
    }
};

/**
 * Manage textarea auto growing when user type, resize, focus the textarea
 */
class TextareaAutoGrow extends HTMLTextAreaElement {

    connectedCallback() {
        this.addEventListener('focus', this.onFocus);
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.onResize);
    }

    onFocus() {
        this.style.overflow = 'hidden';
        this.style.resize = 'none';
        this.style.boxSizing = 'border-box';

        this.autoGrow();

        window.addEventListener('resize', debounce((this.onResize).bind(this), 300));
        this.addEventListener('input', this.autoGrow);
        this.removeEventListener('focus', this.onFocus);
    }

    onResize() {
        this.autoGrow();
    }

    autoGrow() {
        this.style.height = 'auto';
        this.style.height = `${this.scrollHeight}px`;
    }

}

customElements.define('textarea-autogrow', TextareaAutoGrow, {extends: 'textarea'});
