(() => {
    const $simpleMenu = document.getElementById('SIMPLE_MENU');
    const $toggleBtn = document.getElementById('TOGGLE_BTN');
    
    $toggleBtn.addEventListener('click', () => {
        let className = $simpleMenu.className;
        if (className.indexOf('opened') === -1) {
            $simpleMenu.className = (className.trimRight()+' opened');
        } else {
            $simpleMenu.className = (className.replace('opened', ''));
        }
    });
})();
