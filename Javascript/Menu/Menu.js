import MenuItem from './MenuItem';

/**
 * Handle menu
 */
export default class Menu
{

    constructor()
    {
        this.menu = [];
    }

    /**
     * Add an item to the menu
     *
     * @param menuItem
     */
    addItem(menuItem)
    {
        if (!menuItem instanceof MenuItem) throw new Error('You need to add an instance of MenuItem in the method addItem of the Menu');
        this.menu.push(menuItem);
    }

    /**
     * Get the menu
     *
     * @returns {[]|*[]}
     */
    getMenu()
    {
        return this.menu;
    }

    /**
     * Close all sub menus
     */
    closeAllSubMenus()
    {
        this.getMenu().forEach(menuItem => {
           if (menuItem.haveSubMenu() && menuItem.subMenuIsOpened()) {
               menuItem.closeSubMenuAndDescendant();
           }
        });
    }

    /**
     * Get length of menu
     *
     * @returns {number}
     */
    getLength()
    {
        return this.menu.length;
    }

    /**
     * Get first element in menu
     *
     * @returns {*}
     */
    getFirstElement()
    {
        return this.menu[0];
    }

    /**
     * Get last element in menu
     *
     * @returns {*}
     */
    getLastElement()
    {
        return this.menu[this.getLength() - 1];
    }

    /**
     * Initialization of the menu
     */
    init()
    {
        this.menu.forEach(item => {
            item.setAttributes(); // Recursively set attributes
            if (item.haveSubMenu()) {
                item.getSubMenu().menu.forEach(subMenuItem => subMenuItem.setAsTopLevel());
            }
        });
    }

}
