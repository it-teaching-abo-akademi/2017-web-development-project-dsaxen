var stockname;
var quantity;

window.onload=function(){ //this function is executed after DOM has fully loaded
    
        //button onclick
        document.getElementById("addPortfolioButton").onclick = addPortfolio;

        //load local storage

}

// A SIMPLE GET REQUEST FUNCTION
function getRequest(url, callback, context){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function(){ //called when the server responds with data
        if(this.readyState == 4 && this.status == 200){
            var getData = JSON.parse(xmlHttp.responseText);
            callback(getData, context); //pass the list and context to callback function
        }
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

function addPortfolio(){
    var portfolioName = prompt("Please enter the portfolio name:");

    if (portfolioName == null || portfolioName == ""){
        return;
    }
    if (document.getElementById("portfolios").children.length > 9){ //if the number of portfolios exceed 10, prompt with a message..
        alert("You can have at most 10 portfolios. Please remove an existing portfolio before trying to create a new one.")
        return;
    }

    var parentDiv = document.getElementById("portfolios");
    var portfolioDiv = document.createElement("div"); //create portfolio div
    portfolioDiv.style.cssText = "width: 60vh; height: 40vh; border: 2px solid black; position: relative; float: left; margin-top: 15px; margin-left: 15px;";

    topDiv = document.createElement("div");
    topDiv.style.cssText = "position: relative; top: 0; width: 100%; margin-top: 5px; margin-left: 5px; font-size: 18px;";

    middleDiv = document.createElement("div");
    middleDiv.id = "middleDiv";
    middleDiv.style.cssText = "position: relative; top: 10%; width: 90%; height: 50%; border: 2px solid black; font-size: 14px; margin: 0 auto; overflow-y: scroll; overflow-x: hidden;";

    bottomDiv = document.createElement("div"); //create div for bottom line (three buttons)
    bottomDiv.style.cssText = "position: absolute; bottom: 0; width: 100%";

    //create title

    var name = document.createElement("span");
    name.id = "title";
    name.innerHTML = portfolioName;

    //create and append table headers to table

    var tbl = document.createElement("table"); //create the table
    tbl.id = "myTable";
    var tr = document.createElement("tr"); //create header row
    
    var th1 = document.createElement("th"); //create headers (5)
    var th2 = document.createElement("th");
    var th3 = document.createElement("th");
    var th4 = document.createElement("th");
    var th5 = document.createElement("th");
    
    var text1 = document.createTextNode("Name"); //write text for headers (5)
    var text2 = document.createTextNode("Unit value");
    var text3 = document.createTextNode("Quantity"); 
    var text4 = document.createTextNode("Total value"); 
    var text5 = document.createTextNode("Select"); 
    
    th1.appendChild(text1); //append text to headers
    th2.appendChild(text2);
    th3.appendChild(text3);
    th4.appendChild(text4);
    th5.appendChild(text5);
    
    tr.appendChild(th1); //append headers to row
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);
    tr.appendChild(th5);
    
    tbl.appendChild(tr); //append row to table
    middleDiv.appendChild(tbl); //append table to middle div

    //create and append buttons

    var showEurosButton = document.createElement("button");
    showEurosButton.className = "currencyButton";
    showEurosButton.innerHTML = "Show in €";

    var showDollarsButton = document.createElement("button");
    showDollarsButton.className = "currencyButton";
    showDollarsButton.innerHTML = "Show in $";

    var removePortfolioButton = document.createElement("button");
    removePortfolioButton.id = "removePortfolioButton";
    removePortfolioButton.innerHTML = "Remove portfolio";

    var addButton = document.createElement("button");
    addButton.className = "portfolioButton";
    addButton.innerHTML = "Add stock";

    var perfButton = document.createElement("button");
    perfButton.className = "portfolioButton";
    perfButton.innerHTML = "Perf graph";

    var refreshButton = document.createElement("button");
    refreshButton.className = "portfolioButton";
    refreshButton.innerHTML = "Refresh";

    var removeSelectedButton = document.createElement("button");
    removeSelectedButton.id = "removeSelectedButton";
    removeSelectedButton.innerHTML = "Remove selected";

    topDiv.appendChild(name);
    topDiv.appendChild(showEurosButton);
    topDiv.appendChild(showDollarsButton);
    topDiv.appendChild(removePortfolioButton);

    bottomDiv.appendChild(addButton);
    bottomDiv.appendChild(perfButton);
    bottomDiv.appendChild(refreshButton);
    bottomDiv.appendChild(removeSelectedButton);

    portfolioDiv.appendChild(topDiv); //append top line to the parent
    portfolioDiv.appendChild(middleDiv); //append middle line (data)
    portfolioDiv.appendChild(bottomDiv); //append bottom line to the parent

    showEurosButton.addEventListener("click", showEuros); //add listeners to the buttons
    showDollarsButton.addEventListener("click", showDollars);
    removePortfolioButton.addEventListener("click", removePortfolio); 

    addButton.addEventListener("click", addStock);
    perfButton.addEventListener("click", valuePerformance);
    refreshButton.addEventListener("click", refreshStocks);
    removeSelectedButton.addEventListener("click", removeSelected);

    parentDiv.appendChild(portfolioDiv); //append portfolio to the list of portfolios

}

function showEuros(){

}
function showDollars(){

}

function removePortfolio(){
    if(confirm("Are you sure you want to remove this portfolio?")){
        var parentDiv = this.parentNode.parentNode;
        parentDiv.parentNode.removeChild(parentDiv); //remove the parent div (the whole portfolio)
    }
    else{
        return;
    }
}

function addStock(){

    var self = this; //store the context to a variable

    stockName = prompt("Please enter the stock name:");

    if (stockName == null || stockName == ""){
        return;
    }

    quantity = prompt("Please enter the total number of " + stockName + " stocks you want to add:");

    if (quantity == null || quantity == "" || quantity != parseInt(quantity, 10)){
        return;
    }
    getRequest("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" +stockName+ "&interval=1min&apikey=VV6I5M93ATB8Z7JW", callback, self); //send the context further
}
function valuePerformance(){
    alert("PERF GRAPHS");
}
function refreshStocks(){
    alert("REFRESH");
}
function removeSelected(){
    var table = this.parentNode.parentNode.childNodes[1].childNodes[0]; // get the table from the DOM tree
    var checkBoxes = table.getElementsByTagName("input"); //get the checkbox list
    var selectedBoxes = false;

    for (var i = 0; i < checkBoxes.length; i++){ //loop through the table checkboxes to find which ones are selected
        if (checkBoxes[i].checked == true){ //if a row is selected, delete row and decrease length by 1.
            selectedBoxes = true;
        }
    }
    if(selectedBoxes == false){
        alert("You have not selected any stocks.");
        return;
    }
    if(confirm("Are you sure you want to remove selected stocks?")){
        for (var i = 0; i < checkBoxes.length; i++){ //loop through the table checkboxes to find which ones are selected

            if (checkBoxes[i].checked == true){ //if a row is selected, delete row and decrease length by 1.
                table.deleteRow(i+1);
                i--;
            }
        }
    }
    else{
        return;
    }
}
function callback(data, context){

    //get stock value from API

    var unitKeys = Object.keys(data["Time Series (1min)"]); //find the keys
    var recentKey = unitKeys[0]; //the first key has the most recent stock close value.
    var unitValue = data["Time Series (1min)"][recentKey]["4. close"];
    unitValue = Math.round(unitValue*100)/100; //rounds to two decimals

    //get portfolio table and create new rows based on the stock data

    var middleDiv = context.parentNode.parentNode.childNodes[1]; //get the div relative to the add stock button, whose context we stored in the context variable
    var table = middleDiv.childNodes[0]; //the table is the first child of the middle div

    var tr = document.createElement("tr"); //create new row

    var stockCell = document.createElement("td"); //create 5 new table cells
    var unitValueCell = document.createElement("td");
    var quantityCell = document.createElement("td");
    var totalValueCell = document.createElement("td");
    var selectCell = document.createElement("td");


    //input API values! Default currency: $


    var text = document.createTextNode(stockName);
    var text2 = document.createTextNode(unitValue + " $");
    var text3 = document.createTextNode(quantity);
    var text4 = document.createTextNode(unitValue * quantity + " $");

    //End of API values input

    var checkBox = document.createElement('input'); //create checkbox
    checkBox.setAttribute('type', 'checkbox');

    stockCell.appendChild(text);
    unitValueCell.appendChild(text2);
    quantityCell.appendChild(text3);
    totalValueCell.appendChild(text4);
    selectCell.appendChild(checkBox);

    tr.appendChild(stockCell);
    tr.appendChild(unitValueCell);
    tr.appendChild(quantityCell);
    tr.appendChild(totalValueCell);
    tr.appendChild(selectCell);

    table.appendChild(tr);

    table.style.display = "table"; //show table (it is initially hidden)
}