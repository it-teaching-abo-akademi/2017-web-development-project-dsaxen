var currency = "$";

window.onload=function(){ //this function is executed after DOM has fully loaded
    
        //button onclick
        document.getElementById("addPortfolioButton").onclick = addPortfolio;

        //load local storage

}

// A SIMPLE GET REQUEST FUNCTION
function getRequest(url, addStockCallback, context){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function(){ //called when the server responds with data
        if(this.readyState == 4 && this.status == 200){
            var getData = JSON.parse(xmlHttp.responseText);
            addStockCallback(getData, context); //pass the list and context to addStockCallback function
        }
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

function addPortfolio(){
    var totalValue = 0;
    var portfoliosAmount = document.getElementById("portfolios").children.length;
    var portfolioName = prompt("Please enter the portfolio name:");

    if (portfolioName == null || portfolioName == ""){
        return;
    }
    if (portfoliosAmount > 9){ //if the number of portfolios exceed 10, prompt with a message..
        alert("You can have at most 10 portfolios. Please remove an existing portfolio before trying to create a new one.")
        return;
    }

    for(var i = 0; i<portfoliosAmount; i++){ //check for duplicate names
        if(portfolioName == document.getElementById("portfolios").childNodes[i+1].childNodes[0].childNodes[0].innerHTML){ //do not allow same name to occur twice
            alert("A portfolio with that name already exists. Please choose another name.")
            addPortfolio();
            return;
        }
    }


    var parentDiv = document.getElementById("portfolios");
    var portfolioDiv = document.createElement("div"); //create portfolio div
    portfolioDiv.style.cssText = "width: 60vh; height: 40vh; border: 2px solid black; position: relative; float: left; margin-top: 15px; margin-left: 15px;";

    topDiv = document.createElement("div");
    topDiv.style.cssText = "position: relative; top: 0; width: 100%; margin-top: 5px; margin-left: 5px; font-size: 18px;";

    middleDiv = document.createElement("div");
    middleDiv.id = "middleDiv";
    middleDiv.style.cssText = "position: relative; top: 10%; width: 90%; height: 50%; border: 2px solid black; font-size: 14px; margin: 0 auto; overflow-y: scroll; overflow-x: hidden;";

    totalValueDiv = document.createElement("div");
    totalValueDiv.id = "totalValueDiv";
    totalValueDiv.style.cssText = "position: relative; width: 50%; height: 10%; margin-left: 5%; margin-top: 9%; font-weight: bold;";

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
    
    var totalValueText = document.createTextNode("Total value of "+ portfolioName+": "+totalValue + " "+currency);
    totalValueDiv.appendChild(totalValueText);

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

    portfolioDiv.appendChild(topDiv); //append top line with portfolio name, currency exchange and removal..
    portfolioDiv.appendChild(middleDiv); //append middle line (data)
    portfolioDiv.appendChild(totalValueDiv); //append div line with total value
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

    var context = this; //store the context to a variable

    stockName = prompt("Please enter the stock symbol:");

    if (stockName == null || stockName == ""){
        return;
    }

    quantity = prompt("Please enter the total number of " + stockName + " stocks you want to add:");

    if (quantity == null || quantity == "" || quantity != parseInt(quantity, 10)){
        return;
    }
    getRequest("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" +stockName+ "&interval=1min&apikey=VV6I5M93ATB8Z7JW", addStockCallback, context); //send the context further
}
function addStockCallback(data, context){

    //get stock value from API
    if(data["Error Message"] != null){ //if there is an error message, you have typed in an invalid stock symbol.
        alert("You typed a stock symbol that does not exist. Please try again.");
        return;
    }
    var unitKeys = Object.keys(data["Time Series (1min)"]); //find the keys
    var recentKey = unitKeys[0]; //the first key has the most recent stock close value.
    var unitValue = data["Time Series (1min)"][recentKey]["4. close"];
    unitValue = Math.round(unitValue*100)/100; //rounds to two decimals

    //get portfolio table and create new rows based on the stock data

    var middleDiv = context.parentNode.parentNode.childNodes[1]; //get the div relative to the add stock button, whose context we stored in the context variable
    var table = middleDiv.childNodes[0]; //the table is the first child of the middle div
    var tableLength = table.rows.length;

    if(tableLength > 50){ //if the user has more than 50 different stocks, the system will prompt with a message that tells you to delete stocks before adding more
        alert("You have the maximum number of different stocks in this portfolio. Please remove a stock in order to make room for more stocks.");
        return;
    }

    //check if stockname already exists. If it does, we do not add a new row, but instead update the quantity and total value of the particular stock.
    var stockNameCell = 0;

    for(var i = 1; i<tableLength; i++){
        if(table.getElementsByTagName("td")[stockNameCell].innerText == stockName){ //if the stockname already exists, we just update the quantity and total value
            var oldQuantity = parseInt(table.getElementsByTagName("td")[stockNameCell + 2].innerText);
            var newQuantity = parseInt(quantity) + oldQuantity;
            table.getElementsByTagName("td")[stockNameCell + 2].innerText = newQuantity; //update the quantity

            var newTotalValue = Math.round(newQuantity * parseFloat(unitValue) * 100) / 100;
            table.getElementsByTagName("td")[stockNameCell + 3].innerText = newTotalValue + " " + currency;

            updateTotalValue(context);
            return;
        }
        stockNameCell += 5;
    }

    var tr = document.createElement("tr"); //create new row

    var stockCell = document.createElement("td"); //create 5 new table cells
    var unitValueCell = document.createElement("td");
    var quantityCell = document.createElement("td");
    var totalValueCell = document.createElement("td");
    var selectCell = document.createElement("td");


    //input API values! Default currency: $


    var text = document.createTextNode(stockName);
    var text2 = document.createTextNode(unitValue + " " +currency);
    var text3 = document.createTextNode(quantity);
    var text4 = document.createTextNode(Math.round(unitValue * quantity * 100) / 100 + " " +currency);

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

    updateTotalValue(context);
}
function valuePerformance(){
    alert("PERF GRAPHS");
}
function refreshStocks(){ //refresh all the stock values, which means we have to make an API request for every stock in the portfolio.
    var context = this;
    var middleDiv = context.parentNode.parentNode.childNodes[1];
    var table = middleDiv.childNodes[0];
    var tableLength = table.rows.length;
    var stockNameCell = 0;

    for (var i = 1; i<tableLength; i++){ //for every stock, update the unit value and total value
        var refreshStockName = table.getElementsByTagName("td")[stockNameCell].innerText;
        getRequest("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + refreshStockName + "&interval=1min&apikey=VV6I5M93ATB8Z7JW", refreshCallback, context); //send the context further
        stockNameCell += 5;
    }
}
function refreshCallback(data, context){
    //because the requests are asynchronous, we have to check which get request arrives first
    var requestStockName = data["Meta Data"]["2. Symbol"];

    var unitKeys = Object.keys(data["Time Series (1min)"]); //find the keys
    var recentKey = unitKeys[0]; //the first key has the most recent stock close value.
    var unitValue = data["Time Series (1min)"][recentKey]["4. close"]; //the newest unit value
    unitValue = Math.round(parseFloat(unitValue) * 100) / 100;

    var middleDiv = context.parentNode.parentNode.childNodes[1];
    var table = middleDiv.childNodes[0];
    var tableLength = table.rows.length;
    var stockNameCell = 0;

    //update the unit value and total value
    for(var i = 1; i<tableLength; i++){
        if(table.getElementsByTagName("td")[stockNameCell].innerText == requestStockName){ //check which row contains the correct stock

            table.getElementsByTagName("td")[stockNameCell + 1].innerText = unitValue + " " + currency; //change the unit value
            
            var newQuantity = parseInt(table.getElementsByTagName("td")[stockNameCell + 2].innerText);

            var newTotalValue = Math.round(newQuantity * parseFloat(unitValue) * 100) / 100;
            table.getElementsByTagName("td")[stockNameCell + 3].innerText = newTotalValue + " " + currency;
        }
        stockNameCell = stockNameCell + 5;
    }
}
function removeSelected(){
    var table = this.parentNode.parentNode.childNodes[1].childNodes[0]; // get the table from the DOM tree
    var checkBoxes = table.getElementsByTagName("input"); //get the checkbox list
    var selectedBoxes = false;
    var context = this;

    for (var i = 0; i < checkBoxes.length; i++){ //loop through the table checkboxes to find which ones are selected
        if (checkBoxes[i].checked == true){ //if a row is selected, delete row and decrease length by 1.
            selectedBoxes = true;
        }
    }
    if(selectedBoxes == false){
        alert("You have not selected any stocks in this portfolio.");
        return;
    }
    if(confirm("Are you sure you want to remove selected stocks?")){
        for (var i = 0; i < checkBoxes.length; i++){ //loop through the table checkboxes to find which ones are selected

            if (checkBoxes[i].checked == true){ //if a row is selected, delete row and decrease length by 1.
                table.deleteRow(i+1);
                i--;
            }
        }
        updateTotalValue(context); //update the total value, send current context to function
    }
    else{
        return;
    }
}
function updateTotalValue(context){ //updating the total value of the portfolio.
    var totalValue = 0;
    var totalValueCell = 3;
    var middleDiv = context.parentNode.parentNode.childNodes[1]; 
    var table = middleDiv.childNodes[0];
    var tableLength = table.rows.length;



    for(var i = 1; i<tableLength; i++){ //sum the total value
        totalValue = Math.round((totalValue + parseFloat(table.getElementsByTagName("td")[totalValueCell].innerText.split(" ")[0])) * 100 ) / 100; //we add the new value, round to 2 decimals
        totalValueCell += 5;
    }

    //update the total value text

    var totalValueDiv = context.parentNode.parentNode.childNodes[2];
    totalValueDiv.removeChild(totalValueDiv.childNodes[0]); //remove the old value

    var portfolioName = context.parentNode.parentNode.childNodes[0].childNodes[0].innerHTML;

    var totalValueText = document.createTextNode("Total value of "+ portfolioName +": "+ totalValue + " "+currency);
    totalValueDiv.appendChild(totalValueText);
}
