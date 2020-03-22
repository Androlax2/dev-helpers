class Cookie {

    /**
     * Create a cookie
     *
     * @param name
     * @param value
     * @param days
     */
    static create(name, value, days) {
        let expires;

        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
    }

    /**
     * Get a cookie
     *
     * @param name
     * @returns {string|null}
     */
    static read(name) {
        let nameEQ = encodeURIComponent(name) + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0)
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    /**
     * Erase a cookie
     *
     * @param name
     */
    static erase(name) {
        Cookie.create(name, '', -1);
    }

};