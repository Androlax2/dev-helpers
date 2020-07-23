import {addMultipleEventListener, debounce} from "../helpers";
import hoverIntent from '../vendors/hoverintent';

export default class Menu
{

    /**
     * Handle menu dropdown
     *
     * @param container
     * @param settings
     */
    constructor(container, settings = {})
    {
        this.settings = {
            activeClass: 'is-active',
            dropdownMenu: '',
            hoverTimeout: 250,
            glueTo: {
                el: '',
                padding: 0
            },
        };
        this.container = container;
        this.setupSettings(settings);
        this.cacheDOM();
        this.init();
    }

    /**
     * Set up settings defined in the creation of the instance
     *
     * @param settings
     */
    setupSettings(settings)
    {
        if (Object.keys(settings).length > 0) {
            for (let key in settings) {
                if (settings.hasOwnProperty(key) && this.settings.hasOwnProperty(key)) this.settings[key] = settings[key];
            }
        }
    }

    /**
     * Cache DOM elements
     */
    cacheDOM()
    {
        this.$container = document.querySelector(this.container);
        this.$dropdowns = document.querySelectorAll(this.settings.dropdownMenu);
        if (this.settings.glueTo.el) this.$glueTo = document.querySelector(this.settings.glueTo.el);
    }

    /**
     * Get an array of the focusable elements
     *
     * @returns {string[]}
     */
    getFocusableElements()
    {
        return [
            '[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
        ];
    }

    /**
     * Glue dropdowns to the bottom of the glueTo settings
     */
    glueDropdowns()
    {
        if (!this.$glueTo) throw new Error(`The element ${this.settings.glueTo.el} doesn't exists in the DOM.`);

        const {bottom} = this.$glueTo.getBoundingClientRect();

        this.$dropdowns.forEach($dropdown => {
            $dropdown.style.marginTop = '';
            const {top} = $dropdown.getBoundingClientRect();

            $dropdown.style.marginTop = `${(bottom - top) + (this.settings.glueTo.padding ?? null)}px`;
        });
    }

    /**
     * Set up accessibility for the menu
     *
     * https://a11y-guidelines.orange.com/web_EN/exemples/simple-menu/simple-menu.html#
     */
    accessibility()
    {
        this.$dropdowns.forEach($dropdown => {
            const $parent = $dropdown.parentNode;

            // Parent accessibility
            $parent.setAttribute('aria-haspopup', 'true');
            $parent.setAttribute('aria-expanded', 'false');

            // Dropdown accessibility
            $dropdown.setAttribute('role', 'menu');
            $dropdown.setAttribute('aria-hidden', 'true');

            $dropdown.querySelectorAll(this.getFocusableElements()).forEach($focusableElement => $focusableElement.setAttribute('tabindex', '-1'));
            $dropdown.querySelectorAll('a').forEach($dropdownChildren => $dropdownChildren.setAttribute('role', 'menuitem'));
        });
    }

    /**
     * Add dropdown events to menu items
     *
     * Accessibility :
     *
     * - Pressing Enter on the item will open the dropdown menu
     * - Pressing Enter a second time on the item will redirect to the link if there is one
     * - Pressing Escape will close the dropdown menu and trigger back to the trigger item
     */
    dropdownEvents()
    {
        this.$dropdowns.forEach($dropdown => {
            const $parent = $dropdown.parentNode;

            // Accessibility
            $parent.addEventListener('keydown', e => {
                switch (e.key) {
                    case 'Enter':
                        if (!$parent.classList.contains(this.settings.activeClass)) e.preventDefault();
                        this.open($dropdown, $parent.querySelectorAll(this.getFocusableElements())[0]);
                        break;
                    case 'Escape':
                        this.close($dropdown, $parent.querySelectorAll(this.getFocusableElements())[0]);
                        break;
                }
            });

            // Hover
            hoverIntent(
                $parent,
                () => this.open($dropdown),
                () => this.close($dropdown)
            ).options({
                timeout: this.settings.hoverTimeout
            });
        });
    }

    /**
     * Handle accessibility events in the dropdown menu
     *
     * - Use the up / down arrows to navigate through the items
     * - If the user went through the last item or the first item of the menu, we will close the menu
     */
    dropdownAccessibilityEvents($dropdown, trigger)
    {
        const focusableElements = $dropdown.parentNode.querySelectorAll(this.getFocusableElements());
        const firstFocusableElementInDropdown = focusableElements[1];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        if (!firstFocusableElementInDropdown) return;
        window.setTimeout(() => {
            focusableElements.forEach(focusableElement => {
                if (!focusableElement.addEventListener) return;

                focusableElement.addEventListener('keydown', e => {
                    const tab = e.key === 'Tab';
                    const activeElement = document.activeElement;

                    // Tab events
                    if (tab) {
                        if (e.shiftKey) {
                            if (e.target === firstFocusableElementInDropdown) { // Shift + Tab
                                // If the user shift tabbed on the first element in the dropdown, we close the menu
                                e.preventDefault();
                                this.close($dropdown, trigger);
                            } else if (activeElement === trigger) {
                                // If the menu is open and the user want to go back (shift + tab)
                                this.close($dropdown, trigger);
                            }
                        } else if (e.target === lastFocusableElement) { // Tab
                            // If the user tabbed on the last element in the dropdown, we close the menu
                            e.preventDefault();
                            this.close($dropdown, this.getNextFocusableElement(focusableElement) ?? trigger);
                        }
                    } else { // Arrows events
                        if (e.key === 'ArrowDown') {
                            const nextFocusableElement = focusableElements[Array.from(focusableElements).indexOf(focusableElement) + 1];

                            // While there is a next focusable element in the dropdown, we focus it
                            // Else, we close the dropdown
                            if (nextFocusableElement) {
                                nextFocusableElement.focus();
                            } else {
                                this.close($dropdown, this.getNextFocusableElement(focusableElement) ?? trigger);
                            }
                        } else if (e.key === 'ArrowUp') {
                            const previousFocusableElement = focusableElements[Array.from(focusableElements).indexOf(focusableElement) - 1];

                            // While there is a previous focusable element in the dropdown AND the element isn't the "trigger", we focus it
                            // Else, we close the dropdown
                            if (previousFocusableElement && Array.from(focusableElements).indexOf(previousFocusableElement) > 0) {
                                previousFocusableElement.focus();
                            } else {
                                this.close($dropdown, trigger);
                            }
                        }
                    }
                });
            });
        }, 100);
    }

    /**
     * Get next focusable element of an element
     *
     * @param el
     * @returns {any}
     */
    getNextFocusableElement(el)
    {
        const focusableElements = document.querySelectorAll(this.getFocusableElements());
        const index = Array.from(focusableElements).indexOf(el);
        return focusableElements[index + 1];
    }

    /**
     * Open dropdown
     *
     * @param $dropdown
     * @param trigger
     */
    open($dropdown, trigger)
    {
        const $parent = $dropdown.parentNode;

        $parent.classList.add(this.settings.activeClass);

        // Parent accessibility
        $parent.setAttribute('aria-expanded', 'true');

        // Dropdown accessibility
        $dropdown.setAttribute('aria-hidden', 'false');
        $dropdown.querySelectorAll(this.getFocusableElements()).forEach($focusableElement => $focusableElement.setAttribute('tabindex', '0'));

        this.dropdownAccessibilityEvents($dropdown, trigger);
    }

    /**
     * Close dropdown
     *
     * @param $dropdown
     * @param trigger
     */
    close($dropdown, trigger)
    {
        const $parent = $dropdown.parentNode;

        $parent.classList.remove(this.settings.activeClass);

        // Parent accessibility
        $parent.setAttribute('aria-expanded', 'false');

        // Dropdown accessibility
        $dropdown.setAttribute('aria-hidden', 'true');
        $dropdown.querySelectorAll(this.getFocusableElements()).forEach($focusableElement => $focusableElement.setAttribute('tabindex', '-1'));

        // Restore focus
        if (trigger) trigger.focus();
    }

    /**
     * Initialization
     */
    init()
    {
        if (!this.$container) return;
        if (this.settings.glueTo.el) addMultipleEventListener(window, ['load', 'resize'], debounce((this.glueDropdowns).bind(this), 300));
        this.dropdownEvents();
        this.accessibility();
    }

}
