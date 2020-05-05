function hidemenu() {

    document.querySelectorAll('.hidemenu')
        .forEach(element => {
            if (element.style.display !== 'inline-block')
                element.style.display = 'inline-block';

            else
                (element.style.display = 'none');
        })

}