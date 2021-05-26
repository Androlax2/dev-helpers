/**
 * @property {HTMLElement} element
 * @property {{y: number, x: number, r: number, variable: boolean}} options
 */
export default class Parallax {

	/**
     * @param {HTMLElement} element
     */
	constructor(element)
	{
		this.element = element;
		this.options = this._parseAttribute();

		this.elementY = this._calcElementY();
		const observer = new IntersectionObserver(this._onIntersection);
		observer.observe(element);
		this._onScroll();
	}

	/**
     * Bind Parallax to all element with data-parallax attribute and return an array of parallax elements
     *
     * @returns {Parallax[]}
     */
	static bind()
	{
		return Array.from(document.querySelectorAll('[data-parallax]')).map(element => new Parallax(element));
	}

	/**
     * Parse attributes of the data-parallax attribute
     *
     * @returns {{r: number, x: number, variable: boolean, y: number}|any}
     * @private
     */
	_parseAttribute()
	{
		const defaultOptions = {
			y: 0,
			x: 0,
			r: 0,
			variable: false
		};
		if (this.element.dataset.parallax.startsWith('{')) {
			return {...defaultOptions, ...JSON.parse(this.element.dataset.parallax)};
		}
		return {...defaultOptions, y: parseFloat(this.element.dataset.parallax)};
	}

	/**
     * Calculates the position of the element in relation to the top of the page
     *
     * @param {HTMLElement} element
     * @param {number} acc
     * @returns {number}
     * @private
     */
	_offsetTop(element, acc = 0)
	{
		if (element.offsetParent) {
			return this._offsetTop(element.offsetParent, acc + element.offsetTop);
		}
		return acc + element.offsetTop;
	}

	/**
     * @returns {number}
     * @private
     */
	_calcElementY()
	{
		return this._offsetTop(this.element) + this.element.offsetHeight / 2;
	}

    /**
     * @private
     */
    _onScroll = () => {
    	window.requestAnimationFrame(() => {
    		const screenY = window.scrollY + window.innerHeight / 2;
    		const diffY = this.elementY - screenY;

    		let translateY = 0;
    		let translateX = 0;
    		let rotation = 0;

    		if (this.options.y) {
    			translateY = diffY * -1 * this.options.y;
    		}

    		if (this.options.x) {
    			translateX = diffY * -1 * this.options.x;
    		}

    		if (this.options.r) {
    			rotation = diffY * -1 * this.options.r;
    		}

    		if (this.options.variable) {
    			if (this.options.y) {
    				this.element.style.setProperty('--parallaxY', `${translateY}px`);
    			}
    			if (this.options.x) {
    				this.element.style.setProperty('--parallaxX', `${translateX}px`);
    			}
    			if (this.options.r) {
    				this.element.style.setProperty('--parallaxR', `${rotation}px`);
    			}
    		} else {
    			let transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    			if (this.options.r) {
    				transform += ` rotate(${diffY * this.options.r}deg)`;
    			}
    			this.element.style.setProperty('transform', transform);
    		}
    	});
    };

    /**
     * @param {IntersectionObserverEntry[]} entries
     * @private
     */
    _onIntersection = entries => {
    	for (const entry of entries) {
    		if (entry.isIntersecting) {
    			document.addEventListener('scroll', this._onScroll);
    			window.addEventListener('resize', this._onResize);
    			this.elementY = this._calcElementY();
    		} else {
    			document.removeEventListener('scroll', this._onScroll);
    			window.removeEventListener('resize', this._onResize);
    		}
    	}
    };

    /**
     * @private
     */
    _onResize = () => {
    	this.elementY = this._calcElementY();
    	this._onScroll();
    };

}
