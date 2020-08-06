/**
 * DOM Animations
 */
export default class DOMAnimations
{

    /**
     * SlideUp
     *
     * @param {HTMLElement} element
     * @param {Number} duration
     * @returns {Promise<boolean>}
     */
    static slideUp(element, duration = 500)
    {
        return new Promise((resolve, reject) => {
            element.style.height = element.getAttribute('data-height') + 'px';
            element.style.transitionDuration = duration + 'ms';
            element.offsetHeight;
            element.style.height = '0px';
            element.style.paddingTop = '0px';
            element.style.paddingBottom = '0px';
            element.style.marginTop = '0px';
            element.style.marginBottom = '0px';

            setTimeout(() => {
                element.removeAttribute('style');
                resolve(false);
            }, duration);
        });
    }

    /**
     * SlideDown
     *
     * @param {HTMLElement} element
     * @param {Number} duration
     * @returns {Promise<boolean>}
     */
    static slideDown(element, duration = 500)
    {
        return new Promise((resolve, reject) => {
            let displayBefore = window.getComputedStyle(element).display;

            if (displayBefore !== 'none') return;

            element.style.display = 'block';
            let height = element.offsetHeight;
            element.style.overflow = 'hidden';
            element.style.height = '0px';
            element.style.paddingTop = '0px';
            element.style.paddingBottom = '0px';
            element.style.marginTop = '0px';
            element.style.marginBottom = '0px';
            element.offsetHeight;
            element.style.boxSizing = 'border-box';
            element.style.transitionProperty = `height, margin, padding`;
            element.style.transitionDuration = duration + 'ms';
            element.style.height = height + 'px';
            element.style.removeProperty('padding-top');
            element.style.removeProperty('padding-bottom');
            element.style.removeProperty('margin-top');
            element.style.removeProperty('margin-bottom');

            setTimeout(() => {
                element.setAttribute('data-height', height);
                element.style.height = 'auto';
                resolve(true);
            }, duration);
        });
    }

    /**
     * SlideToggle
     *
     * @param {HTMLElement} element
     * @param {Number} duration
     * @returns {Promise<boolean>}
     */
    static slideToggle(element, duration = 500)
    {
        if (window.getComputedStyle(element).display === 'none') {
            return this.slideDown(element, duration);
        } else {
            return this.slideUp(element, duration);
        }
    }

    /**
     * Fade in an element
     *
     * @param element
     * @param display
     */
    static fadeIn(element, display)
    {
        element.style.opacity = 0;
        element.style.display = display || "block";

        (function fade() {
            let val = parseFloat(element.style.opacity);
            if (!((val += .1) > 1)) {
                element.style.opacity = val;
                requestAnimationFrame(fade);
                console.log(val);
            }
        })();
    }

    /**
     * Fade out an element
     *
     * @param element
     */
    static fadeOut(element)
    {
        element.style.opacity = 1;

        (function fade() {
            if ((element.style.opacity -= .1) < 0) {
                element.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    }

    /**
     * Fade toggle
     *
     * @param element
     * @param display
     */
    static fadeToggle(element, display)
    {
        if (window.getComputedStyle(element).display === 'none') {
            return this.fadeIn(element, display);
        } else {
            return this.fadeOut(element);
        }
    }

}
