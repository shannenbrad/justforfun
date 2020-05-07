let orders = [];
function loadOrders(){
    httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function(event){
        if (event.target.readyState == 4 && event.target.status == 200)
            orders = JSON.parse(event.target.response);

        orders.forEach(order => {
            Object.values(order).forEach(val => {
                if (!val){
                    val = "N/A";
                }
            })
        })

        console.log('o', orders);
        let table = document.getElementById('orders-table');
        orders.forEach(order => {
            let newRow = table.insertRow(-1);
            // newRow.style = "outline: thin solid";

            let name = newRow.insertCell(0);
            let email = newRow.insertCell(1);
            let address = newRow.insertCell(2);
            let phoneNumber = newRow.insertCell(3);
            let topknotQty = newRow.insertCell(4);
            let topknotPrint = newRow.insertCell(5);
            let topknotSize = newRow.insertCell(6)
            let bowQty = newRow.insertCell(7);
            let bowPrint = newRow.insertCell(8);
            let bowSize = newRow.insertCell(9);
            let bowType = newRow.insertCell(10);
            let comments = newRow.insertCell(11);
            let status = newRow.insertCell(12);
            email.innerHTML = order.email;
            name.innerHTML = order.fullname;
            address.innerHTML = order.street + "<br>" + order.city + ", " + order.state + " " + order.zipcode;
            phoneNumber.innerHTML = order.phonenumber;
            topknotQty.innerHTML = order.type1qty;
            topknotPrint.innerHTML= order.topknotprint;
            topknotSize.innerHTML = order.topknotsize
            bowQty.innerHTML = order.type2qty;
            bowPrint.innerHTML = order.bowprint;
            bowSize.innerHTML = order.bowsize;
            bowType.innerHTML = order.bowtype;
            comments.innerHTML = order.additionalcomments;
            status.innerHTML = order.status


        })
        console.log(table);
    }

    httpRequest.open('GET', '/get-orders', true);
    httpRequest.send();
}

loadOrders();