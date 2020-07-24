import {addMultipleEventListener, debounce} from "../helpers";
import hoverIntent from '../vendors/hoverintent';

/**
 * Handle menubar
 *
 * Accessibility : https://www.w3.org/WAI/tutorials/menus/application-menus/
 */
export default class Menubar
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
        this.$dropdowns = this.$container.querySelectorAll(this.settings.dropdownMenu);
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

    focus($el)
    {
        if ($el) $el.focus();
    }

    /**
     * Get focusable elements in menu (top level)
     *
     * @returns {[]|*[]}
     */
    getFocusableElementsInMenu()
    {
        if (!this.$focusableElementsInMenu) {
            const $menuFocusableElements = this.$container.querySelectorAll(this.getFocusableElements());
            this.$focusableElementsInMenu = [];
            $menuFocusableElements.forEach($menuFocusableElement => $menuFocusableElement.getAttribute('tabindex') !== '-1' ? this.$focusableElementsInMenu.push($menuFocusableElement) : null);
        }
        return this.$focusableElementsInMenu;
    }

    /**
     * Get focusable elements outside the top level menu
     *
     * Return an array with the previous focusable element at the index 0 and the next one at the index 1
     *
     * @returns {[any, any]|any[]}
     */
    getFocusableElementsOutsideMenu()
    {
        if (!this.$focusableElementsOutsideMenu) {
            const $focusableElementsInMenu = this.getFocusableElementsInMenu();
            this.$focusableElementsOutsideMenu = [
                this.getPreviousFocusableElement($focusableElementsInMenu[0]),
                this.getNextFocusableElement($focusableElementsInMenu[$focusableElementsInMenu.length - 1])
            ];
        }
        return this.$focusableElementsOutsideMenu;
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
        // Parent accessibility
        this.$container.setAttribute('role', 'menubar');
        Array.from(this.$container.children).forEach($menuChildren => $menuChildren.setAttribute('role', 'menuitem'));

        // Dropdowns accessibility
        this.$dropdowns.forEach($dropdown => {
            const $parent = $dropdown.parentNode;

            // Parent accessibility
            $parent.setAttribute('aria-haspopup', 'true');
            $parent.setAttribute('aria-expanded', 'false');

            // Dropdown accessibility
            $dropdown.setAttribute('role', 'menu');
            $dropdown.setAttribute('aria-hidden', 'true');

            $dropdown.querySelectorAll(this.getFocusableElements()).forEach($focusableElement => $focusableElement.setAttribute('tabindex', '-1'));
            Array.from($dropdown.children).forEach($dropdownChildren => $dropdownChildren.setAttribute('role', 'menuitem'));
        });

        // Menu Events
        this.currentFocusInMenu = null;
        const $focusableElementsInMenu = this.getFocusableElementsInMenu();
        $focusableElementsInMenu.forEach($focusableElementInMenu => {
            $focusableElementInMenu.addEventListener('focus', () => this.currentFocusInMenu = $focusableElementsInMenu.indexOf($focusableElementInMenu));
        });
        this.$container.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case 37: // Arrow left
                    this.currentFocusInMenu = this.currentFocusInMenu === 0 ? $focusableElementsInMenu.length - 1 : this.currentFocusInMenu - 1;
                    this.focus($focusableElementsInMenu[this.currentFocusInMenu]);
                    break;
                case 39: // Arrow right
                    this.currentFocusInMenu = this.currentFocusInMenu === ($focusableElementsInMenu.length - 1) ? 0 : this.currentFocusInMenu + 1;
                    this.focus($focusableElementsInMenu[this.currentFocusInMenu]);
                    break;
                case 9: // Tab
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.focus(this.getFocusableElementsOutsideMenu()[0]);
                    } else {
                        this.focus(this.getFocusableElementsOutsideMenu()[1]);
                    }
                    break;
            }
        });
    }

    /**
     * Add dropdown events to menu items
     */
    dropdownEvents()
    {
        this.$dropdowns.forEach($dropdown => {
            const $parent = $dropdown.parentNode;

            // Accessibility
            $parent.addEventListener('keydown', e => {
                switch (e.keyCode) {
                    case 32: // Space
                    case 13: // Enter
                    case 8: // Return
                        if (!$parent.classList.contains(this.settings.activeClass)) e.preventDefault();
                        this.open($dropdown);
                        break;
                    case 38: // Arrow up
                        if ($parent.classList.contains(this.settings.activeClass)) return;
                        this.open($dropdown, $dropdown.querySelectorAll(this.getFocusableElements()).length);
                        break;
                    case 40: // Arrow down
                        if ($parent.classList.contains(this.settings.activeClass)) return;
                        this.open($dropdown, 1);
                        break;
                    case 27: // Escape
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
     */
    dropdownAccessibilityEvents($dropdown, focusIndex)
    {
        const focusableElements = $dropdown.parentNode.querySelectorAll(this.getFocusableElements());
        const firstFocusableElementInDropdown = focusableElements[1];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        if (focusIndex) {
            focusableElements[focusIndex].focus();
        }

        if (!firstFocusableElementInDropdown) return;
        window.setTimeout( () => {
            focusableElements.forEach(focusableElement => {
                if (!focusableElement.addEventListener) return;

                focusableElement.addEventListener('keydown', e => {
                    switch (e.key) {
                        case 'ArrowDown':
                            const nextFocusableElement = focusableElements[Array.from(focusableElements).indexOf(focusableElement) + 1];

                            // While there is a next focusable element in the dropdown, we focus it
                            // Else we go back to the first focusable element in the dropdown
                            if (nextFocusableElement) {
                                nextFocusableElement.focus();
                            } else {
                                firstFocusableElementInDropdown.focus();
                            }
                            break;
                        case 'ArrowUp':
                            const previousFocusableElement = focusableElements[Array.from(focusableElements).indexOf(focusableElement) - 1];

                            // While there is a previous focusable element in the dropdown AND the element isn't the "trigger", we focus it
                            // Else we go back to the last focusable element in the dropdown
                            if (previousFocusableElement && Array.from(focusableElements).indexOf(previousFocusableElement) > 0) {
                                previousFocusableElement.focus();
                            } else {
                                lastFocusableElement.focus();
                            }
                            break;
                        case 'Tab':
                            e.preventDefault();
                            this.close($dropdown);
                            break;
                        case 'ArrowRight':
                        case 'ArrowLeft':
                            this.close($dropdown);
                            break;
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
     * Get previous focusable element of an element
     *
     * @param el
     * @returns {any}
     */
    getPreviousFocusableElement(el)
    {
        const focusableElements = document.querySelectorAll(this.getFocusableElements());
        const index = Array.from(focusableElements).indexOf(el);
        return focusableElements[index - 1];
    }

    /**
     * Open dropdown
     *
     * @param $dropdown
     * @param focus
     */
    open($dropdown, focus)
    {
        const $parent = $dropdown.parentNode;

        $parent.classList.add(this.settings.activeClass);

        // Parent accessibility
        $parent.setAttribute('aria-expanded', 'true');

        // Dropdown accessibility
        $dropdown.setAttribute('aria-hidden', 'false');
        $dropdown.querySelectorAll(this.getFocusableElements()).forEach($focusableElement => $focusableElement.setAttribute('tabindex', '0'));

        this.dropdownAccessibilityEvents($dropdown, focus);
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
