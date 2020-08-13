import Menu from './Menu';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import MegaMenu from './MegaMenu';

/**
 * Manage accessible menu
 *
 * https://www.w3.org/TR/wai-aria-practices/#menu
 */
export default class A11yMenu
{

    /**
     * Handle menu accessibility
     *
     * @param menubar
     * @param settings
     */
    constructor(menubar, settings = {})
    {
        this.settings = {
            activeClass: 'is-active',
            item: '',
            itemHasSubMenu: '',
            megaMenuClass: '',
            subMenu: ''
        };
        this._setupSettings(settings);

        if (!menubar) throw new Error('You need to set a menubar selector.');
        if (!this.settings.item) throw new Error('You need to set a item selector. This is the selector of each top level menu.');
        if (!this.settings.itemHasSubMenu) throw new Error('You need to set parent selector for the sub menus.');
        if (!this.settings.subMenu) throw new Error('You need to set a sub menu selector. This is the selector of each sub menus.');
        if (!this.settings.activeClass) throw new Error('You need to set an active class for the sub menus.');

        this.menubar = menubar;
        this.positionInMenu = -1;
        this._cacheDOM();
        this._init();
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
     * Get an array of the focusable elements
     *
     * @returns {string[]}
     */
    static getFocusableElements()
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
     * Get key codes
     *
     * @returns {{Space: number, Escape: number, Tab: number, ArrowLeft: number, Enter: number, End: number, ArrowUp: number, ArrowRight: number, Home: number, ArrowDown: number}}
     */
    static getKeyCodes()
    {
        return {
            ArrowUp: 38,
            ArrowDown: 40,
            ArrowLeft: 37,
            ArrowRight: 39,
            Enter: 13,
            Space: 32,
            Home: 36,
            End: 35,
            Tab: 9,
            Escape: 27
        }
    }

    /**
     * Get key code by name
     *
     * @param keyName
     * @returns {*}
     */
    static getKeyCode(keyName)
    {
        const keyCode = A11yMenu.getKeyCodes()[keyName];
        if (typeof keyCode === 'undefined') throw new Error(`The key ${keyName} doesn't exists.`);
        return A11yMenu.getKeyCodes()[keyName];
    }

    /**
     * Get all focusable elements in the document
     *
     * @returns {NodeListOf<HTMLElementTagNameMap[string[]]>}
     */
    getAllFocusableElements()
    {
        if (!this.$documentFocusableElements) this.$documentFocusableElements = document.querySelectorAll(A11yMenu.getFocusableElements())
        return this.$documentFocusableElements;
    }

    /**
     * Cache DOM Elements
     *
     * @private
     */
    _cacheDOM()
    {
        this.$menubar = document.querySelector(this.menubar);
        if (!this.$menubar) throw new Error(`The menubar ${this.menubar} doesn't exists in the DOM.`);

        this.$items = this.$menubar.querySelectorAll(this.settings.item);
        this.$topLevelItems = [...this.$items].filter($item => $item.parentNode === this.$menubar);
        if (!this.$topLevelItems || this.$topLevelItems.length === 0) throw new Error(`Top level ${this.settings.item} need to be direct children of ${this.menubar}`);

        this._handleDOMExceptions();
    }

    /**
     * Ensure that the given elements are present in DOM
     *
     * @private
     */
    _handleDOMExceptions()
    {
        if (!this.$items || this.$items.length === 0) throw new Error(`No ${this.$items} exists in the DOM.`);
    }

    /**
     * Get position in menu
     *
     * @returns {number}
     */
    getPositionInMenu()
    {
        return this.positionInMenu;
    }

    _handleMenu()
    {
        const _this = this;
        const menu = new Menu();

        [...this.$topLevelItems].forEach($topLevelItem => {
            const menuItem = new MenuItem($topLevelItem, _this.settings.activeClass);
            const $itemSubMenu = $topLevelItem.querySelector(_this.settings.subMenu);
            const isMegaMenu = $topLevelItem.classList.contains(_this.settings.megaMenuClass);

            const subMenu = ($itemSubMenu && !isMegaMenu) ? new SubMenu($itemSubMenu) : null;
            const megaMenu = ($itemSubMenu && isMegaMenu) ? new MegaMenu($itemSubMenu) : null;

            if (subMenu) {
                subMenu.addItems(_this.settings.item, _this.settings.itemHasSubMenu, _this.settings.subMenu, _this.settings.activeClass);
                menuItem.addSubMenu(subMenu);
            } else if (megaMenu) {
                megaMenu.addItems(_this.settings.item, _this.settings.activeClass);
                menuItem.addMegaMenu(megaMenu);
            }

            menu.addItem(menuItem);
        });

        this.menu = menu;
    }

    /**
     * Get previous focusable element of menu
     *
     * @returns {*}
     */
    getPreviousFocusableElementOfMenu()
    {
        const index = [...this.getAllFocusableElements()].indexOf(this.menu.getFirstElement().getToggler());
        return this.getAllFocusableElements()[index - 1];
    }

    /**
     * Get next focusable element after menu
     *
     * @returns {*}
     */
    getNextFocusableElementOfMenu()
    {
        const index = [...this.getAllFocusableElements()].indexOf(this.menu.getLastElement().getToggler());
        return this.getAllFocusableElements()[index + 1];
    }

    /**
     * Handle events of menubar
     *
     * @private
     */
    _handleEvents()
    {
        this.$menubar.addEventListener('keydown', e => {

            if (e.keyCode === A11yMenu.getKeyCode('Tab')) {
                if (e.shiftKey) {
                    const $previous = this.getPreviousFocusableElementOfMenu();
                    if ($previous) {
                        e.preventDefault();
                        $previous.focus();
                    }
                } else {
                    const $next = this.getNextFocusableElementOfMenu();
                    if ($next) {
                        e.preventDefault();
                        $next.focus();
                    }
                }
                this.menu.closeAllSubMenus();
            }

        });

        this._getMenu().forEach(topLevelItem => {

            // Events for the top level items
            topLevelItem.getToggler().addEventListener('keydown', e => {
                this.positionInMenu = this._getMenu().indexOf(topLevelItem);
                let menuItem = this._getMenu()[this.getPositionInMenu()];
                let isDropdownOpen = menuItem.haveSubMenu() ? menuItem.getSubMenu().isOpen() : false;

                switch (e.keyCode) {

                    // Arrow Left events
                    case A11yMenu.getKeyCode('ArrowLeft'):
                        e.preventDefault();
                        if (this.getPositionInMenu() === 0) {
                            this.menu.getLastElement().getToggler().focus();
                        } else {
                            this._getMenu()[this.getPositionInMenu() - 1].getToggler().focus();
                        }

                        // Close all opened menus
                        this.menu.closeAllSubMenus();

                        break;

                    // Arrow Right events
                    case A11yMenu.getKeyCode('ArrowRight'):
                        e.preventDefault();
                        if (this.getPositionInMenu() === this.menu.getLength() - 1) {
                            this.menu.getFirstElement().getToggler().focus();
                        } else {
                            this._getMenu()[this.getPositionInMenu() + 1].getToggler().focus();
                        }

                        // Close all opened menus
                        this.menu.closeAllSubMenus();

                        break;

                    // Home events
                    case A11yMenu.getKeyCode('Home'):
                        e.preventDefault();
                        this.menu.getFirstElement().getToggler().focus();

                        break;

                    // End events
                    case A11yMenu.getKeyCode('End'):
                        e.preventDefault();
                        this.menu.getLastElement().getToggler().focus();
                        break;

                    // Open menu (Space/Enter)
                    case A11yMenu.getKeyCode('Space'):
                    case A11yMenu.getKeyCode('Enter'):
                        if (!menuItem.haveSubMenu()) return;

                        if (!isDropdownOpen) {
                            e.preventDefault();
                            menuItem.openSubMenu();
                        }
                        break;

                    // Open menu and focus first item
                    case A11yMenu.getKeyCode('ArrowDown'):
                        if (!menuItem.haveSubMenu()) return;
                        e.preventDefault();

                        if (!isDropdownOpen) menuItem.openSubMenu();
                        menuItem.focusFirstElementInSubMenu();

                        break;

                    // Open menu and focus last item
                    case A11yMenu.getKeyCode('ArrowUp'):
                        if (!menuItem.haveSubMenu()) return;
                        e.preventDefault();

                        if (!isDropdownOpen) menuItem.openSubMenu();
                        menuItem.focusLastElementInSubMenu();

                        break;

                    // Close menu (Escape)
                    case A11yMenu.getKeyCode('Escape'):
                        if (isDropdownOpen) {
                            e.preventDefault();
                            menuItem.closeSubMenu();
                        }
                        break;
                }
            });

            // Events for the first sub menu
            if (topLevelItem.haveSubMenu()) {
                topLevelItem.getSubMenu().menu.forEach(subMenuItem => {
                    subMenuItem.getToggler().addEventListener('keydown', e => {

                        switch (e.keyCode) {

                            // Arrow Left events
                            case A11yMenu.getKeyCode('ArrowLeft'):
                                if (subMenuItem.haveSubMenu() && !subMenuItem.subMenuIsOpened()) return;

                                e.preventDefault();
                                if (this.getPositionInMenu() === 0) {
                                    this.menu.getLastElement().getToggler().focus();
                                } else {
                                    this._getMenu()[this.getPositionInMenu() - 1].getToggler().focus();
                                }

                                // Close all opened menus
                                this.menu.closeAllSubMenus();

                                break;

                            // Arrow Right events
                            case A11yMenu.getKeyCode('ArrowRight'):
                                if (subMenuItem.haveSubMenu() && subMenuItem.subMenuIsOpened()) return;

                                e.preventDefault();
                                if (this.getPositionInMenu() === this.menu.getLength() - 1) {
                                    this.menu.getFirstElement().getToggler().focus();
                                } else {
                                    this._getMenu()[this.getPositionInMenu() + 1].getToggler().focus();
                                }

                                // Close all opened menus
                                this.menu.closeAllSubMenus();

                                break;

                        }

                    });
                });
            }

        });
    }

    /**
     * Set up aria attributes
     *
     * @private
     */
    _attributes()
    {
        this.$menubar.setAttribute('role', 'menubar');
    }

    /**
     * Get menus
     *
     * @returns {*[]}
     * @private
     */
    _getMenu()
    {
        return this.menu.getMenu();
    }

    /**
     * Init the accessible menu
     *
     * @private
     */
    _init()
    {
        this._attributes();
        this._handleMenu();
        this.menu.init();
        this._handleEvents();
    }

}
