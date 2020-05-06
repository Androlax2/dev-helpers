/**
 * Class to manage hover then click on touch devices
 */
class DoubleTapToGo
{

    constructor(selector)
    {
        if( !( 'ontouchstart' in window ) &&
            !navigator.msMaxTouchPoints &&
            !navigator.userAgent.toLowerCase().match( /windows phone os 7/i ) ) return false;

        document.querySelectorAll(selector).forEach(tapHover => {
            tapHover.addEventListener('click', function (e) {
                let tapHover = this;

                if (tapHover.classList.contains('hover')) {
                    return true;
                } else {
                    let tapHovers = [...document.querySelectorAll(selector)];

                    tapHover.classList.add('hover');
                    tapHovers.filter(element => {
                        if (element !== tapHover) {
                            element.classList.remove('hover');
                        }
                    });

                    e.preventDefault();
                    return false;
                }
            });
        });
    }

}