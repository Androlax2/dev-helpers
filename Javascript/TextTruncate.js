/**
 * Truncate a text multilines
 */
export default class TextTruncate
{

    /**
     * @param $el
     * @param wordLimit
     * @param settings
     */
    constructor($el, wordLimit, settings)
    {
        this.$el = $el;
        this.wordLimit = wordLimit;
        this.settings = {
            showMoreTextAttribute: 'data-show-more-text',
            showLessTextAttribute: 'data-show-less-text',
            showMoreButtonClass: 'showMore',
            overflow: ' ...'
        };
        this._setupSettings(settings);

        if (this._hasShowMore()) {
            this.showMoreText = this.$el.getAttribute(this.settings.showMoreTextAttribute);
            this.showLessText = this.$el.getAttribute(this.settings.showLessTextAttribute);

            if (!this.showMoreText && this.settings.showMoreTextAttribute !== '') throw new Error(`You need to set the attribute ${this.settings.showMoreTextAttribute} for the text.`);
            if (!this.showLessText && this.settings.showLessTextAttribute !== '') throw new Error(`You need to set the attribute ${this.settings.showLessTextAttribute} for the text.`);
        }

        this.init();
    }

    /**
     * Set up settings defined in the creation of the instance
     *
     * @param settings
     * @private
     */
    _setupSettings(settings)
    {
        if (Object.keys(settings).length > 0) {
            for (let key in settings) {
                if (settings.hasOwnProperty(key) && this.settings.hasOwnProperty(key)) this.settings[key] = settings[key];
            }
        }
    }

    /**
     * Has show more button
     *
     * @returns {boolean}
     * @private
     */
    _hasShowMore()
    {
        return this.settings.showMoreTextAttribute !== '' || this.settings.showLessTextAttribute !== '';
    }

    /**
     * Create show more button
     *
     * @returns {HTMLButtonElement}
     * @private
     */
    _createShowMoreButton()
    {
        const $showMoreButton = document.createElement('button');
        $showMoreButton.textContent = this.showMoreText;
        if (this.settings.showMoreButtonClass) $showMoreButton.classList.add(this.settings.showMoreButtonClass);

        $showMoreButton.onclick = e => {
            e.preventDefault();

            const isTruncated = this.$el.getAttribute('data-is-truncated').toLowerCase() === 'true';
            const truncatedText = this.$el.getAttribute('data-truncated-text');
            const $showMoreButton = this.$el.querySelector('button');
            const $span = this.$el.querySelector('span');

            if (isTruncated) {
                this.$el.setAttribute('data-is-truncated', 'false');
                $span.textContent = ` ${truncatedText}`;
                $showMoreButton.textContent = this.showLessText;
                $span.setAttribute('tabindex', '0');
                $span.focus();
            } else {
                this.$el.setAttribute('data-is-truncated', 'true');
                $span.textContent = this.settings.overflow;
                $showMoreButton.textContent = this.showMoreText;
                $span.setAttribute('tabindex', '-1');
            }
        };

        return $showMoreButton;
    }

    /**
     * Init the text truncation
     */
    init()
    {
        let content = (this.$el.textContent.trim()).split(' ');
        if (content.length < this.wordLimit) return;

        this.$el.setAttribute('data-is-truncated', 'true');
        this.$el.setAttribute('data-truncated-text', (content.slice(this.wordLimit, content.length)).join(' '));
        content = content.slice(0, this.wordLimit);
        content = content.join(' ');

        const $overflow = document.createElement('span');
        $overflow.textContent = this.settings.overflow;

        this.$el.textContent = content;
        this.$el.appendChild($overflow);
        if (this._hasShowMore()) this.$el.appendChild(this._createShowMoreButton());
    }

}
