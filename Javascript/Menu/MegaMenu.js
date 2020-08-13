import Dropdown from './Dropdown';
import MenuItem from './MenuItem';

/**
 * Handle mega menu
 */
export default class MegaMenu extends Dropdown
{

    /**
     * Add items recursively to the mega menu
     *
     * @param itemSelector
     * @param activeClass
     */
    addItems(itemSelector, activeClass)
    {
        const $itemsInMegaMenu = this.$menu.querySelectorAll(itemSelector);

        [...$itemsInMegaMenu].forEach($itemInMegaMenu => {
            const menuItem = new MenuItem($itemInMegaMenu, activeClass);
            this.menu.push(menuItem);
        });
    }

}
