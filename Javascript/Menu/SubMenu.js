import Dropdown from './Dropdown';
import MenuItem from './MenuItem';

/**
 * Handle sub menu
 */
export default class SubMenu extends Dropdown
{

    /**
     * Add items recursively to the sub menu
     *
     * @param itemSelector
     * @param itemHaveSubMenuSelector
     * @param subMenuSelector
     * @param activeClass
     */
    addItems(itemSelector, itemHaveSubMenuSelector, subMenuSelector, activeClass)
    {
        const $itemsInSubMenu = this.$menu.querySelectorAll(itemSelector);

        [...$itemsInSubMenu].forEach($itemInSubMenu => {
            if ($itemInSubMenu.closest(subMenuSelector) !== this.$menu) return;

            const menuItem = new MenuItem($itemInSubMenu, activeClass);
            const $itemSubMenu = $itemInSubMenu.querySelector(subMenuSelector);
            const subMenu = $itemSubMenu ? new SubMenu($itemSubMenu) : null;

            if (subMenu) {
                subMenu.addItems(itemSelector, itemHaveSubMenuSelector, subMenuSelector, activeClass);
                menuItem.addSubMenu(subMenu);
            }

            this.menu.push(menuItem);
        });
    }

}
