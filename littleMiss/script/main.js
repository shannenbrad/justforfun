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
    console.log(event.target.id);
    let qty = document.getElementById(event.target.id + 'qty');
    let print = document.getElementById(event.target.id + 'print');
    if (event.target.checked) {
        qty.style.display = 'block';
        print.style.display = 'block';

    }

    else {
        qty.style.display = 'none';
        print.style.display = 'none';
    }
}