function hidemenu() {

    document.querySelectorAll('.hidemenu')
        .forEach(element => {
            if (element.style.display !== 'block')
                element.style.display = 'block';

            else
                (element.style.display = 'none');
        })

}