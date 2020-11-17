export default class ScrollAnimations {

	constructor(settings = {}) {
		this.settings = {
			fadeIn: {
				root: null,
				rootMargin: '0px',
				threshold: .1
			}
		};

		this.setupSettings(settings);
		this.init();
	}

	/**
	 * Set up settings defined in the creation of the instance
	 *
	 * @param settings
	 */
	setupSettings(settings) {
		if (Object.keys(settings).length > 0) {
			for (let key in settings) {
				if (settings.hasOwnProperty(key) && this.settings.hasOwnProperty(key)) this.settings[key] = settings[key];
			}
		}
	}

	/**
	 * Fade in content
	 */
	fadeIn() {
		let _this = this;

		const handleIntersect = function (entries, observer) {
			entries.forEach(entry => {
				if (entry.intersectionRatio > _this.settings.fadeIn.threshold) {
					entry.target.classList.remove('fade-in');
					observer.unobserve(entry.target);
				}
			});
		};

		window.addEventListener('DOMContentLoaded', function () {
			const observer = new IntersectionObserver(handleIntersect, _this.settings.fadeIn);
			document.querySelectorAll('.fade-in').forEach(fadeIn => {
				observer.observe(fadeIn);
			});
		});
	}

	/**
	 * Initialization
	 */
	init() {
		document.documentElement.classList.add('scroll-animations-loaded');
		this.fadeIn();
	}

};
