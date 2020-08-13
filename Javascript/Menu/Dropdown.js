/**
 * Base dropdown class
 */
export default class Dropdown
{

    constructor($dropdown)
    {
        if (!$dropdown) throw new Error('$dropdown parameter can\'t be null.');

        this.$menu = $dropdown;
        this.isOpened = false;
        this.menu = [];
    }

    /**
     * Set attributes
     */
    setAttributes()
    {
        this.getMenu().setAttribute('role', 'menu');
        this.getMenu().setAttribute('aria-hidden', 'true');
        this.menu.forEach(menuItemInSubMenu => menuItemInSubMenu.getToggler().setAttribute('tabindex', '-1'));
        this.menu.forEach(item => item.setAttributes());
    }

    /**
     * Is dropdown open
     *
     * @returns {any}
     */
    isOpen()
    {
        return this.isOpened;
    }

    /**
     * Get menu
     *
     * @returns {*}
     */
    getMenu()
    {
        return this.$menu;
    }

    /**
     * Get Menu length
     *
     * @returns {*}
     */
    getMenuLength()
    {
        return this.menu.length;
    }

    /**
     * Define if the dropdown is the first one
     */
    setAsTopMenu()
    {
        this.topMenu = true;
    }

    /**
     * Get first element in sub menu
     *
     * @returns {{el: (*|Element|SVGAElement|HTMLAnchorElement), position: number}}
     */
    getFirstElement()
    {
        return {
            el: this.menu[0].getToggler(),
            position: 0
        };
    }

    /**
     * Get last element in sub menu
     *
     * @returns {{el: (*|Element|SVGAElement|HTMLAnchorElement), position: number}}
     */
    getLastElement()
    {
        const position = this.getMenuLength() - 1;
        return {
            el: this.menu[position].getToggler(),
            position: position
        };
    }

    /**
     * Open the dropdown
     */
    open()
    {
        this.getMenu().setAttribute('aria-hidden', 'false');
        this.menu.forEach(menuItemInSubMenu => menuItemInSubMenu.getToggler().setAttribute('tabindex', '0'));
        this.isOpened = true;
    }

    /**
     * Close the dropdown
     */
    close()
    {
        this.getMenu().setAttribute('aria-hidden', 'true');
        this.menu.forEach(menuItemInSubMenu => menuItemInSubMenu.getToggler().setAttribute('tabindex', '-1'));
        this.isOpened = false;
    }

}
