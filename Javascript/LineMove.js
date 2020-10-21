const addMultipleEventListener = (element, events, handler) => events.forEach(e => element.addEventListener(e, handler));

const debounce = (callback, delay) => {
    let timer;
    return function () {
        let args = arguments,
            context = this;

        clearTimeout(timer);
        timer = setTimeout(() => callback.apply(context, args), delay);
    }
};

const throttle = (callback, delay) => {
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
 * Line moving on cursor hover
 */
export default class LineMove {

	/**
	 * How many times line moved (to debug correctly)
	 *
	 * @type {number}
	 */
	static lineMoves = 0;

	constructor(settings = {}) {
		this.settings = {
			element: '',
			hover: '',
			activeSelector: '',
			debug: false
		};
		this._setupSettings(settings);

		if (!this.settings.element) throw new Error('You need to specify element selector for LineMove to work correctly.');
		if (!this.settings.hover) throw new Error('You need to specify hover selector for LineMove to work correctly.');

		this._cacheDOM();

		this._init();
	}

	/**
	 * Increment and return total line moves
	 *
	 * @returns {number}
	 */
	static getLineMoves() {
		return this.lineMoves++;
	}

	/**
	 * Cache DOM elements
	 *
	 * @private
	 */
	_cacheDOM() {
		this.$el = document.querySelector(this.settings.element);
		this.$activeItem = document.querySelector(this.settings.activeSelector);
		this.$hovers = document.querySelectorAll(this.settings.hover);
	}

	/**
	 * Set up settings defined in the creation of the instance
	 *
	 * @param settings
	 * @private
	 */
	_setupSettings(settings) {
		if (Object.keys(settings).length > 0) {
			for (let key in settings) {
				if (settings.hasOwnProperty(key) && this.settings.hasOwnProperty(key)) this.settings[key] = settings[key];
			}
		}
	}

	/**
	 * Move the line to an element
	 *
	 * @param $element
	 * @param resize
	 */
	moveTo($element, resize = false) {
		if (
			typeof $element === 'undefined' ||
			$element === null ||
			$element.length === 0 ||
			window.getComputedStyle(this.$el).display === 'none' ||
			this.$el.offsetParent === null
		) return;

		if (this.settings.debug) {
			console.info(
				`%c ${LineMove.getLineMoves()} : Line\n%o \n has moved to \n %o. \n`,
				'background: #222; color: #bada55',
				this.$el,
				$element
			);
		}

		const elementRect = $element.getBoundingClientRect();
		const isLineActive = this.$el.getAttribute('line-is-active');

		// No transition if we don't see the line
		if (!isLineActive) {
			this.$el.setAttribute('line-is-active', 'true');
			this.$el.style.transition = 'none';
		} else {
			this.$el.style.transition = '';
		}

		// No transition if we're resizing
		if (resize) this.$el.style.transition = 'none';

		this.$el.style.width = `${elementRect.width}px`;
		this.$el.style.left = `${elementRect.left}px`;

		if (!resize) {
			if (this.$previousActiveLineItem) this.$previousActiveLineItem.removeAttribute('line-item-is-active');
			$element.setAttribute('line-item-is-active', 'true');
			this.$previousActiveLineItem = $element;
			this.$activeLineItem = $element;
		}
	}

	/**
	 * Move the line to the active item on load
	 *
	 * @private
	 */
	_moveLineOnLoad() {
		this.moveTo(this.$activeItem);
	}

	/**
	 * Handle hover on line
	 *
	 * @private
	 */
	_handleHover() {
		const that = this;

		this.$hovers.forEach($hover => {
			addMultipleEventListener($hover, ['mouseover', 'focusin', 'touchstart'], throttle(function () {
				that.moveTo(this);
			}, 25));
			addMultipleEventListener($hover, ['mouseover', 'focusout', 'touchstart'], throttle(function () {
				that.moveTo(that.$activeItem);
			}, 25));
		});
	}

	/**
	 * Move the line on resize
	 *
	 * @private
	 */
	_onResize = () => {
		this.moveTo(this.$activeLineItem, true);
	};

	/**
	 * Initialization of everything
	 *
	 * @private
	 */
	_init() {
		window.addEventListener('load', () => {
			this._moveLineOnLoad();
			this._handleHover();
		});
		window.addEventListener('resize', debounce(this._onResize, 5));
	}

}
