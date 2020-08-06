if (!document.querySelector('.anchorBlock')) return;

        new GumShoe('.anchorBlock__links a', {
            reflow: true,
            nested: true,
            nestedClass: 'active-parent',
            offset: () => {
                let defaultOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anchor-block-links-offset')),
                    $adminBar = document.querySelector('#wpadminbar'),
                    adminBarHeight = ($adminBar ? $adminBar.getBoundingClientRect().height : 0),
                    headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));

                return defaultOffset + headerHeight + adminBarHeight;
            }
        });
