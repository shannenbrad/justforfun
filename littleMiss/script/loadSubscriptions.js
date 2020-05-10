let subscriptions = [];
function loadsubscriptions(){
    subscriptions = [];


    httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function(event){
        if (event.target.readyState == 4 && event.target.status == 200)
            subscriptions = JSON.parse(event.target.response);

        subscriptions.forEach(subscription => {
            Object.values(subscription).forEach(val => {
                if (!val){
                    val = "N/A";
                }
            })
        })

        console.log('o', subscriptions);
        let table = document.getElementById('table-body');
        table.innerHTML = '';
        
        subscriptions.forEach(monthlysubscription => {
            let newRow = table.insertRow(-1);
            // newRow.style = "outline: thin solid";

            let name = newRow.insertCell(0);
            let email = newRow.insertCell(1);
            let address = newRow.insertCell(2);
            let phoneNumber = newRow.insertCell(3);
            let product = newRow.insertCell(4);
            let bowPreference = newRow.insertCell(5);
            let comments = newRow.insertCell(6);
            let status = newRow.insertCell(7);
            email.innerHTML = monthlysubscription.email;
            name.innerHTML = monthlysubscription.fullname;
            address.innerHTML = monthlysubscription.street + "<br>" + monthlysubscription.city + ", " + monthlysubscription.state + " " + monthlysubscription.zipcode;
            phoneNumber.innerHTML = monthlysubscription.phonenumber;
            product.innerHTML = monthlysubscription.products;
            bowPreference.innerHTML = monthlysubscription.bowsize + ", " + monthlysubscription.bowtype;
            comments.innerHTML = monthlysubscription.additionalcomments;
            let statusString = monthlysubscription.status;
            if (statusString !== "COMPLETE"){
                statusString += "<input type='button' value='Complete order' onclick='completesubscription(" + monthlysubscription.monthly_id +")'>";
            
            }
            else {
                statusString += "<input type='button' value='New Month' onclick='newMonthSubscription(" + monthlysubscription.monthly_id +")'>";
            }
            status.innerHTML = statusString; 
            

        })
        console.log(table);
    }

    httpRequest.open('GET', '/get-subscriptions', true);
    httpRequest.send();
}

function completesubscription(monthlysubscriptionId){
    console.log("completeing", monthlysubscriptionId);
    httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function(event){
        
        if (event.target.readyState == 4 && event.target.status == 200)
            loadsubscriptions();
    }
 
    httpRequest.open('POST', '/complete-subscription', true);
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpRequest.send(`monthly_id=${monthlysubscriptionId}`);
}


function newMonthSubscription(monthlysubscriptionId){
    console.log("newmonth", monthlysubscriptionId);
    httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function(event){
        
        if (event.target.readyState == 4 && event.target.status == 200)
            loadsubscriptions();
    }
 
    httpRequest.open('POST', '/newmonth-subscription', true);
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpRequest.send(`monthly_id=${monthlysubscriptionId}`);
}


loadsubscriptions();