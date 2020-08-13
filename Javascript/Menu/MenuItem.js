import Dropdown from './Dropdown';
import A11yMenu from "./A11yMenu";

/**
 * Handle a menu item
 */
export default class MenuItem
{

    constructor($item, activeClass)
    {
        if (!$item) throw new Error('$item parameter in the class MenuItem can\'t be null.');
        if (!activeClass) throw new Error('activeClass need to be defined for a MenuItem.');

        this.activeClass = activeClass;
        this.$item = $item;
        this.currentFocusInSubMenu = -1;
    }

    /**
     * Add sub menu
     *
     * @param subMenu
     */
    addSubMenu(subMenu)
    {
        if (!subMenu instanceof Dropdown) throw new Error('You need to add an instance of Dropdown in the method addSubMenu of the MenuItem');
        this.subMenu = subMenu;
        this._handleEventsOfSubMenu();
    }

    /**
     * Add mega menu
     *
     * @param megaMenu
     */
    addMegaMenu(megaMenu)
    {
        if (!megaMenu instanceof Dropdown) throw new Error('You need to add an instance of Dropdown in the method addMegaMenu of the MenuItem');
        this.subMenu = megaMenu;
        this._handleEventsOfSubMenu();
    }

    /**
     * Get the toggler for the menu item
     *
     * It need to be a link (a tag)
     *
     * @returns {*|Element|SVGAElement|HTMLAnchorElement}
     */
    getToggler()
    {
        if (!this.$toggler) this.$toggler = this.getItem().querySelector('a');
        if (!this.$toggler) throw new Error('Menu item need to have a link inner.');
        return this.$toggler;
    }

    /**
     * Get active class
     *
     * @returns {*}
     */
    getActiveClass()
    {
        return this.activeClass;
    }

    /**
     * Get item
     *
     * @returns {*}
     */
    getItem()
    {
        return this.$item;
    }

    /**
     * Get sub menu
     *
     * @returns {*}
     */
    getSubMenu()
    {
        if (!this.subMenu) throw new Error('Menu item doesn\'t have a sub menu.');
        return this.subMenu;
    }

    /**
     * Does menu item have a sub menu ?
     *
     * @returns {boolean}
     */
    haveSubMenu()
    {
        return !!this.subMenu;
    }

    /**
     * Set attributes for the sub menu
     * Set attributes for the toggler
     */
    setAttributes()
    {
        const $toggler = this.getToggler();
        $toggler.setAttribute('role', 'menuitem');

        if (this.haveSubMenu()) {
            $toggler.setAttribute('aria-haspopup', 'true');
            $toggler.setAttribute('aria-expanded', 'false');
            this.getSubMenu().setAttributes();
        }
    }

    /**
     * Open the sub menu
     */
    openSubMenu()
    {
        this.getItem().classList.add(this.getActiveClass());
        this.getToggler().setAttribute('aria-expanded', 'true');
        this.getSubMenu().open(this.getActiveClass());
    }

    /**
     * Close the sub menu
     */
    closeSubMenu()
    {
        this.getItem().classList.remove(this.getActiveClass());
        this.getToggler().setAttribute('aria-expanded', 'false');
        this.getSubMenu().close(this.getActiveClass());
        this.currentFocusInSubMenu = -1;
    }

    /**
     * Close the sub menu and all descendant
     */
    closeSubMenuAndDescendant()
    {
        const isSubMenuOpened = this.subMenuIsOpened();
        this.closeSubMenu();
        if (this.haveSubMenu() && isSubMenuOpened) {
            this.getSubMenu().menu.forEach(subMenuItem => {
               if (subMenuItem.haveSubMenu() && subMenuItem.subMenuIsOpened()) subMenuItem.closeSubMenuAndDescendant();
            });
        }
    }

    /**
     * Is sub menu open
     *
     * @returns {*}
     */
    subMenuIsOpened()
    {
        return this.getSubMenu().isOpen();
    }

    /**
     * Focus an index in the sub menu
     *
     * @param index
     */
    focusInSubMenu(index)
    {
        if (typeof index === 'undefined') throw new Error('Index to focus should be defined.');
        if (index < 0 || index > this.getSubMenu().getMenuLength()) throw new Error(`Please define an index between 0 and ${this.getSubMenu().getMenuLength()} (length of sub menu)`);

        this.getSubMenu().menu[index].getToggler().focus();
        this.currentFocusInSubMenu = index;
    }

    /**
     * Focus the first element in the sub menu
     */
    focusFirstElementInSubMenu()
    {
        const $firstElementInSubMenu = this.getSubMenu().getFirstElement();
        if (!$firstElementInSubMenu.el) throw new Error('There was an error trying to focus the first element in the sub menu.');

        $firstElementInSubMenu.el.focus();
        this.currentFocusInSubMenu = $firstElementInSubMenu.position;
    }

    /**
     * Focus the last element in the sub menu
     */
    focusLastElementInSubMenu()
    {
        const $lastElementInSubMenu = this.getSubMenu().getLastElement();
        if (!$lastElementInSubMenu.el) throw new Error('There was an error trying to focus the last element in the sub menu.');

        $lastElementInSubMenu.el.focus();
        this.currentFocusInSubMenu = $lastElementInSubMenu.position;
    }

    /**
     * Get the current focus in the sub menu
     *
     * @returns {number}
     */
    getCurrentFocusInSubMenu()
    {
        return this.currentFocusInSubMenu;
    }

    /**
     * Handle events of the sub menu
     *
     * @private
     */
    _handleEventsOfSubMenu()
    {
        if (!this.haveSubMenu()) return;

        this.getSubMenu().menu.forEach(menuItemInSubMenu => {
            menuItemInSubMenu.getToggler().addEventListener('keydown', e => {
                const positionInMenu = this.getCurrentFocusInSubMenu();
                const subMenuLength = this.getSubMenu().getMenuLength();
                const isDropdownOpen = menuItemInSubMenu.haveSubMenu() ? menuItemInSubMenu.subMenuIsOpened() : false;

                switch (e.keyCode) {

                    // Arrow Up move item to top
                    case A11yMenu.getKeyCode('ArrowUp'):
                        e.preventDefault();
                        if (positionInMenu === 0) {
                            this.focusLastElementInSubMenu();
                        } else {
                            this.focusInSubMenu(positionInMenu - 1);
                        }

                        if (isDropdownOpen) menuItemInSubMenu.closeSubMenu();

                        break;

                    // Arrow down move item to bottom
                    case A11yMenu.getKeyCode('ArrowDown'):
                        e.preventDefault();
                        if (positionInMenu === subMenuLength - 1) {
                            this.focusFirstElementInSubMenu();
                        } else {
                            this.focusInSubMenu(positionInMenu + 1);
                        }

                        if (isDropdownOpen) menuItemInSubMenu.closeSubMenu();

                        break;

                    // Home key
                    case A11yMenu.getKeyCode('Home'):
                        e.preventDefault();
                        this.focusFirstElementInSubMenu();
                        if (isDropdownOpen) menuItemInSubMenu.closeSubMenu();
                        break;

                    // End key
                    case A11yMenu.getKeyCode('End'):
                        e.preventDefault();
                        this.focusLastElementInSubMenu();
                        if (isDropdownOpen) menuItemInSubMenu.closeSubMenu();
                        break;

                    // Open menu (Space/Enter)
                    case A11yMenu.getKeyCode('Space'):
                    case A11yMenu.getKeyCode('Enter'):
                        if (!menuItemInSubMenu.haveSubMenu()) return;

                        if (!isDropdownOpen) {
                            e.preventDefault();
                            menuItemInSubMenu.openSubMenu();
                        }
                        break;

                    // Arrow left
                    case A11yMenu.getKeyCode('ArrowLeft'):
                        if (!menuItemInSubMenu.haveSubMenu() && menuItemInSubMenu.topLevel) return;
                        e.preventDefault();

                        this.closeSubMenu();
                        this.getToggler().focus();

                        break;

                    // Arrow right
                    case A11yMenu.getKeyCode('ArrowRight'):
                        if (!menuItemInSubMenu.haveSubMenu() && menuItemInSubMenu.topLevel) return;
                        e.preventDefault();

                        if (menuItemInSubMenu.haveSubMenu()) {
                            if (!isDropdownOpen) menuItemInSubMenu.openSubMenu();
                            menuItemInSubMenu.focusFirstElementInSubMenu();
                        } else {
                            this.closeSubMenu();
                            this.getToggler().focus();
                        }

                        break;

                    // Escape
                    case A11yMenu.getKeyCode('Escape'):
                        e.preventDefault();
                        this.closeSubMenu();
                        this.getToggler().focus();

                        break;

                }

            });
        });
    }

}
