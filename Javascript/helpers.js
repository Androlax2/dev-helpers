/**
 * Is touch device ?
 *
 * @type {boolean}
 */
export const isTouchDevice =
    (('ontouchstart' in window) ||
        (navigator.MaxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));

/**
 * Add multiple events to an element
 *
 * @param element
 * @param events
 * @param handler
 */
export const addMultipleEventListener = (element, events, handler) => events.forEach(e => element.addEventListener(e, handler));

/**
 * Call callback function after a certain delay
 *
 * @param callback
 * @param delay
 * @returns {function(...[*]=)}
 */
export const debounce = (callback, delay) => {
    let timer;
    return function () {
        let args = arguments,
            context = this;

        clearTimeout(timer);
        timer = setTimeout(() => callback.apply(context, args), delay);
    }
};

/**
 * Avoid callback call too many time
 *
 * @param callback
 * @param delay
 * @returns {function(...[*]=)}
 */
export const throttle = (callback, delay) => {
    let last,
        timer;

    return function () {
        let context = this,
            now = +new Date(),
            args = arguments;

        if (last && now < last + delay) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                last = now;
                callback.apply(context, args);
            }, delay);
        } else {
            last = now;
            callback.apply(context, args);
        }
    };
};

/**
 * Return top and left offset of an element
 *
 * @param el
 * @returns {{top: number, left: number}}
 */
export const offsetOf = el => {
    let rect = el.getBoundingClientRect(),
        bodyEl = document.body;

    return {
        top: rect.top + bodyEl.scrollTop,
        left: rect.left + bodyEl.scrollLeft
    }
};
