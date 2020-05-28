/**
 * Class to manage hover then click on touch devices
 */
export default class DoubleTapToGo
{

    constructor(selector, className = 'hover')
    {
        if( !( 'ontouchstart' in window ) &&
            !navigator.msMaxTouchPoints &&
            !navigator.userAgent.toLowerCase().match( /windows phone os 7/i ) ) return false;

        document.querySelectorAll(selector).forEach(tapHover => {
            tapHover.addEventListener('click', function (e) {
                let tapHover = this;

                if (tapHover.classList.contains(className)) {
                    return true;
                } else {
                    let tapHovers = [...document.querySelectorAll(selector)];

                    tapHover.classList.add(className);
                    tapHovers.filter(element => {
                        if (element !== tapHover) {
                            element.classList.remove(className);
                        }
                    });

                    e.preventDefault();
                    return false;
                }
            });
        });
    }

}
