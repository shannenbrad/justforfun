function hidemenu() {

    document.querySelectorAll('.hidemenu')
        .forEach(element => {
            if (element.style.display !== 'block')
                element.style.display = 'block';

            else
                (element.style.display = 'none');
        })

}

function showQtyInput(event) {
    let element = document.getElementById(event.target.id + 'qty');
    if (event.target.checked)
        element.style.display = 'block';

    else
        element.style.display = 'none';
}