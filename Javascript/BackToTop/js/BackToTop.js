/**
 * Avoid callback call too many time
 *
 * @param callback
 * @param delay
 * @returns {function(...[*]=)}
 */
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

class BackToTop extends HTMLElement {

	constructor() {
		super();
		this.settings = {
			appearScrollAmount: this.getAttribute('appear-scroll-amount') || 0
		};

		this.onScroll = throttle(this.onScroll.bind(this), 100);
		this.addEventListener('click', function (e) {
			e.preventDefault();
			this.scrollToTop();
		});
	}

	connectedCallback() {
		// Disable back to top button from screen reader. They already have a shortcut to do this
		this.setAttribute('aria-hidden', 'true');

		if (this.settings.appearScrollAmount > 0) {
			window.addEventListener('scroll', this.onScroll);
		} else {
			this.classList.add('is-active');
		}
	}

	/**
	 * Remove scrolling event if the back to top doesn't exist anymore
	 */
	disconnectedCallback() {
		window.removeEventListener('scroll', this.onScroll);
	}

	/**
	 * Scroll to top on click on the back to top
	 */
	scrollToTop(duration = 500) {
		let cosParameter = window.scrollY / 2,
		    scrollCount  = 0,
		    oldTimestamp = performance.now();

		function step(newTimestamp) {
			scrollCount += Math.PI / (
			               duration / (
				               newTimestamp - oldTimestamp
			               )
			);
			if (scrollCount >= Math.PI) window.scrollTo(0, 0);
			if (window.scrollY === 0) return;
			window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
			oldTimestamp = newTimestamp;
			window.requestAnimationFrame(step);
		}

		window.requestAnimationFrame(step);
	}

	/**
	 * On scroll, add is-active class to the element
	 * if we go further appearScrollAmount
	 */
	onScroll() {
		let scroll = window.scrollY;

		if (scroll > this.settings.appearScrollAmount) {
			this.classList.add('is-active');
			this.dispatchEvent(new Event('backToTopIsActive'));
		} else {
			this.classList.remove('is-active');
			this.dispatchEvent(new Event('backToTopIsHidden'));
		}
	}

}

customElements.define('back-to-top', BackToTop);
