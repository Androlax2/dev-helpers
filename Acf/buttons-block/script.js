        const $buttonsBlock = document.querySelectorAll('.buttonsBlock');
        if ($buttonsBlock.length === 0) return;

        $buttonsBlock.forEach($buttonBlock => {
            const $childrens = Array.from($buttonBlock.children);
            const maxWidth = Math.max.apply(null, $childrens.map($children => {
                $children.removeAttribute('style');
                return $children.getBoundingClientRect().width;
            }));
            const maxHeight = Math.max.apply(null, $childrens.map($children => {
                $children.removeAttribute('style');
                return $children.getBoundingClientRect().height;
            }));
            $childrens.forEach($children => {
                $children.style.width = `${maxWidth}px`;
                $children.style.height = `${maxHeight}px`;
            });
        });
