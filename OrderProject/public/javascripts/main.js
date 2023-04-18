const storeIdValues = [98053, 98007, 98077, 98055, 98011, 98046];
const cdIdValues = [123456, 123654, 321456, 321654, 654123, 654321, 543216, 354126, 621453, 623451];
let orderArray = [];

// define a constructor to create movie objects
class OrderObject {
    constructor() {
        this.ID = Math.random().toString(16).slice(5);
        this.StoreID;
        this.SalesPersonID;
        this.CdID;
        this.PricePaid;
        this.Date;
    }
}

//continuously updates the time
setInterval(function(){
    document.getElementById("order-time").value = new Date().toISOString();
}, 100);

function Get500Orders(){
    //After the for loop, this will contain 500 orders
    let currentTime = new Date(document.getElementById("order-time").value);
    for(let i = 0; i < 500; i++){
        //Set the time
        let newOrder = new OrderObject();
        if (i != 0){
            currentTime.setSeconds(currentTime.getSeconds() + Math.floor(Math.random() * 1501  + 300));            
        }
        newOrder.Date = currentTime.toISOString();
        newOrder.StoreID = document.getElementById("storeID").value;
        newOrder.SalesPersonID = document.getElementById("salesPersonID").value;
        newOrder.CdID = document.getElementById("cdID").value;
        newOrder.PricePaid = document.getElementById("pricePaid").value;

        //Add code to send newOrder to node server below here
        //Or try to send the whole array instead further down
        fetch('/addOrder', {
            method: "POST",
            body: JSON.stringify(newOrder),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => console.log(json), createList())
        .catch(err => console.log(err));

        //makes new random data points & sends them to 
        SetOrderValues(); 
    }
}

//set the remaining values for an order object when CREATE button is clicked
function SetOrderValues(){
    let order = new OrderObject();
    //0-5
    order.StoreID = storeIdValues[Math.floor(Math.random() * 6)];
    //sets the SalesPersonID
    switch(order.StoreID){
        case 98053:
            //1-4
            order.SalesPersonID = Math.floor(Math.random() * 4  + 1);
            break;
        case 98007:
            //5-8
            order.SalesPersonID = Math.floor(Math.random() * 4  + 5);
            break;
        case 98077:
            //9-12
            order.SalesPersonID = Math.floor(Math.random() * 4  + 9);
            break;
        case 98055:
            //13-16
            order.SalesPersonID = Math.floor(Math.random() * 4 + 13);
            break;
        case 98011:
            //17-20
            order.SalesPersonID = Math.floor(Math.random() * 4 + 17);
            break;
        case 98046:
            //21-24
            order.SalesPersonID = Math.floor(Math.random() * 4 + 21);
    }
    //0-9
    order.CdID = cdIdValues[Math.floor(Math.random() * 10)];
    //5-15
    order.PricePaid = Math.floor(Math.random() * 11 + 5);
    //Update the Elements with the new values
    document.getElementById("storeID").value = order.StoreID; 
    document.getElementById("salesPersonID").value = order.SalesPersonID;
    document.getElementById("cdID").value = order.CdID;
    document.getElementById("pricePaid").value = order.PricePaid;
}
//Create a function that sends the current order to the node server
function SubmitOne(){
    let newOrder = new OrderObject();

    //Get values for new order object from html
    newOrder.Date = document.getElementById("order-time").value;
    newOrder.StoreID = document.getElementById("storeID").value;
    newOrder.SalesPersonID = document.getElementById("salesPersonID").value;
    newOrder.CdID = document.getElementById("cdID").value;
    newOrder.PricePaid = document.getElementById("pricePaid").value;

    //Fetch to make sure server is receiving object
    fetch('/oneOrder', {
        method: "POST",
        body: JSON.stringify(newOrder),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json()) 
    .then(json => console.log(json), createList())
    .catch(err => console.log(err));
    console.log(newOrder);
}

function sortPriceSalesPerson(){
        // update local array from server
        fetch('/sortPriceSalesPerson')
        // Handle success
        .then(response => response.json())  // get the data out of the response object
        .then( responseData => fillUL(responseData))    //update our array and li's
        .catch(err => console.log('Request Failed', err)); // Catch errors
        
}

function sortStoreCdPrice(){
    // update local array from server
    fetch('/sortStoreCdPrice')
    // Handle success
    .then(response => response.json())  // get the data out of the response object
    .then( responseData => fillUL(responseData))    //update our array and li's
    .catch(err => console.log('Request Failed', err)); // Catch errors
}

//A function that says what the page does when it loads
document.addEventListener("DOMContentLoaded", function () {
    SetOrderValues();
    createList();

    document.getElementById("buttonDelete").addEventListener("click", function () {
        deleteOrder(document.getElementById("deleteID").value);      
    });    
});  
// end of wait until document has loaded event  *************************************************************************

function createList() {
    // update local array from server
    fetch('/getAllOrders')
    // Handle success
    .then(response => response.json())  // get the data out of the response object
    .then( responseData => fillUL(responseData))    //update our array and li's
    .catch(err => console.log('Request Failed', err)); // Catch errors
};
    
function fillUL(data) {
    orderArray = data;
    console.log(orderArray);
    // clear prior data
    var divOrderList = document.getElementById("divOrderList");
    while (divOrderList.firstChild) {    // remove any old data so don't get duplicates
        divOrderList.removeChild(divOrderList.firstChild);
    };
    
    var ul = document.createElement('ul');
       
    orderArray.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        li.innerHTML = element.ID + ":  &nbsp &nbsp  &nbsp &nbsp " + 
        element.StoreID + "  &nbsp &nbsp  &nbsp &nbsp "  +
        element.SalesPersonID + " &nbsp &nbsp  &nbsp &nbsp  " + 
        element.CdID  + " &nbsp &nbsp  &nbsp &nbsp  " + 
        element.PricePaid  + " &nbsp &nbsp  &nbsp &nbsp  " + 
        element.Date;
        ul.appendChild(li);
    });
    divOrderList.appendChild(ul);
}
    
function deleteOrder(ID) {
    fetch('/DeleteOrder/' + ID, {
        method: "DELETE",
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json()) 
    .then(json => console.log(json), createList())
    .catch(err => console.log(err));
}