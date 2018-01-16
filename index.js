var usdToEurRate;
var historicalDataList = [];
var getRequests;

window.onload=function(){ //this function is executed after DOM has fully loaded
    
        //button onclick
        document.getElementById("addPortfolioButton").onclick = addPortfolio;

        //overlay onclick hides overlay
        document.getElementById("overlay").onclick = hideOverlay;
        //load local storage

}

// A SIMPLE GET REQUEST FUNCTION
function getRequest(url, callback, context){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function(){ //called when the server responds with data
        if(this.readyState == 4 && this.status == 200){
            var getData = JSON.parse(xmlHttp.responseText);
            callback(getData, context); //pass the list and context to addStockCallback function
        }
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}
function hideOverlay(){ //hide overlays and remove the old canvas

    var performanceDiv = document.getElementById("performanceDiv");
    document.getElementById("overlay").style.display = "none"; //hide overlays
    performanceDiv.style.display = "none";

    while(performanceDiv.firstChild){ //remove the canvas
        performanceDiv.removeChild(performanceDiv.firstChild);
    }

    historicalDataList.length = 0; //empty the historical data list
    
}
function addPortfolio(){
    var totalValue = 0;
    var portfoliosAmount = document.getElementById("portfolios").children.length;
    var portfolioName = prompt("Please enter the portfolio name:");

    if (portfolioName == null || portfolioName == ""){
        return;
    }
    if(portfolioName.length > 15){
        alert("The portfolio name is limited to 15 characters. Please choose a shorter name.");
        addPortfolio();
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


    var portfolioList = document.getElementById("portfolios");
    var portfolioDiv = document.createElement("div"); //create portfolio div
    portfolioDiv.style.cssText = "width: 70vh; height: 40vh; border: 2px solid black; position: relative; float: left; margin-top: 15px; margin-left: 15px;";

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

    var currency = "$";
    
    var totalValueText = document.createTextNode("Total value of "+ portfolioName+": "+totalValue + " "+currency);
    totalValueDiv.appendChild(totalValueText);

    //create and append buttons

    var showEurosButton = document.createElement("button");
    showEurosButton.className = "currencyButton";
    showEurosButton.innerHTML = "Show in €";

    var showDollarsButton = document.createElement("button");
    showDollarsButton.className = "currencyButton";
    showDollarsButton.innerHTML = "Show in $";
    showDollarsButton.disabled = true; //we begin initially with dollars.

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

    portfolioList.appendChild(portfolioDiv); //append portfolio to the list of portfolios

}

function showEuros(){
    loader = document.getElementById("loader"); //initiate loading sign and overlay
    loaderOverlay = document.getElementById("loaderOverlay");

    loader.style.display = "block";
    loaderOverlay.style.display = "block";

    var context = this;
    var topDiv = context.parentNode.parentNode.childNodes[0]; 
    var showEurosButton = topDiv.childNodes[1];
    var showDollarsButton = topDiv.childNodes[2];

    if (showEurosButton.disabled != true){ //if our current currency is dollars, we can change the currency.

        //API request current currency exchange rate, from dollars to euros. We need to change every single stock unit value in the portfolio.

        getRequest("https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey=VV6I5M93ATB8Z7JW", showEurosCallback, context);
    }
    else{
        alert("You are already displaying the portfolio in €.");
    }
}
function showEurosCallback(data, context){
    var topDiv = context.parentNode.parentNode.childNodes[0]; 
    var showEurosButton = topDiv.childNodes[1];
    var showDollarsButton = topDiv.childNodes[2];
    usdToEurRate = data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]; //get the rate
    usdToEurRate = parseFloat(usdToEurRate); //convert to float value

    //If the table has any stocks, we need to traverse through them and change the unit value and total value.

    var middleDiv = context.parentNode.parentNode.childNodes[1]; //get the div relative to the show in € button, whose context we stored in the context variable
    var table = middleDiv.childNodes[0]; //the table is the first child of the middle div
    var tableLength = table.rows.length;

    var stockNameCell = 0;

    for(var i = 1; i<tableLength; i++){ //traverse through the rows in the table

        var dollarValue = parseFloat(table.getElementsByTagName("td")[stockNameCell + 1].innerText.split(" ")[0]); //get the unit value

        var euroValue = Math.round(dollarValue * usdToEurRate * 100) / 100; //currency conversion, two decimals
        table.getElementsByTagName("td")[stockNameCell + 1].innerText = euroValue + " €";

        var newTotalValue = Math.round((euroValue * parseInt(table.getElementsByTagName("td")[stockNameCell + 2].innerText)) * 100) / 100; 
        table.getElementsByTagName("td")[stockNameCell + 3].innerText = newTotalValue + " €";
        stockNameCell = stockNameCell + 5;
    }

    showEurosButton.disabled = true; //update buttons
    showDollarsButton.disabled = false;

    updateTotalValue(context); //after updating the tables, we need to update the total value.
}
function showDollars(){
    loader = document.getElementById("loader"); //initiate loading sign and overlay
    loaderOverlay = document.getElementById("loaderOverlay");

    loader.style.display = "block";
    loaderOverlay.style.display = "block";

    var context = this;
    var topDiv = context.parentNode.parentNode.childNodes[0]; 
    var showEurosButton = topDiv.childNodes[1];
    var showDollarsButton = topDiv.childNodes[2];

    if (showDollarsButton.disabled != true){ //if our current currency is euros, we can change the currency.

        //API request current currency exchange rate, from euros to dollars. We need to change every single stock unit value in the portfolio.

        getRequest("https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=USD&apikey=VV6I5M93ATB8Z7JW", showDollarsCallback, context);
    }
    else{
        alert("You are already displaying the portfolio in $.");
    }
}
function showDollarsCallback(data, context){

    var topDiv = context.parentNode.parentNode.childNodes[0]; 
    var showEurosButton = topDiv.childNodes[1];
    var showDollarsButton = topDiv.childNodes[2];
    var rate = data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]; //get the rate
    rate = parseFloat(rate); //convert to float value

    //If the table has any stocks, we need to traverse through them and change the unit value and total value.

    var middleDiv = context.parentNode.parentNode.childNodes[1]; //get the div relative to the show in € button, whose context we stored in the context variable
    var table = middleDiv.childNodes[0]; //the table is the first child of the middle div
    var tableLength = table.rows.length;

    var stockNameCell = 0;

    for(var i = 1; i<tableLength; i++){ //traverse through the rows in the table

        var euroValue = parseFloat(table.getElementsByTagName("td")[stockNameCell + 1].innerText.split(" ")[0]); //get the unit value

        var dollarValue = Math.round(euroValue * rate * 100) / 100; //currency conversion, two decimals
        table.getElementsByTagName("td")[stockNameCell + 1].innerText = dollarValue + " $";

        var newTotalValue = Math.round((dollarValue * parseInt(table.getElementsByTagName("td")[stockNameCell + 2].innerText)) * 100) / 100; 
        table.getElementsByTagName("td")[stockNameCell + 3].innerText = newTotalValue + " $";
        stockNameCell = stockNameCell + 5;
    }

    showDollarsButton.disabled = true; //update buttons
    showEurosButton.disabled = false;

    updateTotalValue(context); //after updating the tables, we need to update the total value.
}

function removePortfolio(){
    if(confirm("Are you sure you want to remove this portfolio?")){
        var portfolioDiv = this.parentNode.parentNode;
        portfolioDiv.parentNode.removeChild(portfolioDiv); //remove the parent div (the whole portfolio)
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

    loader = document.getElementById("loader"); //initiate loading sign and overlay
    loaderOverlay = document.getElementById("loaderOverlay");
    loader.style.display = "block";
    loaderOverlay.style.display = "block";

    getRequest("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + stockName + "&interval=1min&apikey=VV6I5M93ATB8Z7JW", addStockCallback, context); //send the context further
}
function addStockCallback(data, context){

    //set the correct currency

    var topDiv = context.parentNode.parentNode.childNodes[0]; 
    var showEurosButton = topDiv.childNodes[1];
    var showDollarsButton = topDiv.childNodes[2];
    var currency;

    if(showEurosButton.disabled){ //if the eurobutton is disabled, it means that the current currency is euros
        currency = "€";
    }
    else{
        currency = "$";
    }

    //get stock value from API
    if(data["Error Message"] != null){ //if there is an error message, you have typed in an invalid stock symbol.
        alert("You typed a stock symbol that does not exist. Please try again.");
        return;
    }
    var unitKeys = Object.keys(data["Time Series (1min)"]); //find the keys
    var recentKey = unitKeys[0]; //the first key has the most recent stock close value.
    var unitValue = data["Time Series (1min)"][recentKey]["4. close"];
    unitValue = Math.round(unitValue*100)/100; //rounds to two decimals

    //the get request returns values in dollars. If euro is chosen before adding a stock, we need to manipulate the unit value.

    if(showEurosButton.disabled){ // in this case, euros are chosen. We use the latest rate which we got when we clicked on the "show in €" or "Refresh exchange rate" button. button.
        unitValue = Math.round(unitValue * parseFloat(usdToEurRate) * 100) / 100;
    }

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

    //input API values, Default currency: $

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
function valuePerformance(){ //API request for every stock with historical data (up to 20 years)

    loader = document.getElementById("loader"); //initiate loading sign and overlay
    loaderOverlay = document.getElementById("loaderOverlay");

    loader.style.display = "block";
    loaderOverlay.style.display = "block";

    var context = this;

    var table = this.parentNode.parentNode.childNodes[1].childNodes[0];
    var tableLength = table.rows.length;

    if(tableLength == 1){
        alert("You do not have any stocks to graph. Please add a stock.");
        return;
    }
    var stockNameCell = 0;
    getRequests = tableLength - 1;

    for (var i = 1; i < tableLength; i++){ //loop through every stock in the table, 
        var stockName = table.getElementsByTagName("td")[stockNameCell].innerText;
        getRequest("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + stockName + "&outputsize=full&apikey=VV6I5M93ATB8Z7JW", gatherHistoricalData, context)
        stockNameCell += 5;
    }
}
function gatherHistoricalData(data, context){
    getRequests--;
    var unitKeys = Object.keys(data["Time Series (Daily)"]); //the keys are the dates

    for (var i = 0; i<unitKeys.length; i++){
        var unitValue = data["Time Series (Daily)"][unitKeys[i]]["5. adjusted close"]; //use the adjusted close
        var dateValuePair = {"date": unitKeys[i], "value": unitValue};
        historicalDataList.push(dateValuePair);
    }

    var stockName = data["Meta Data"]["2. Symbol"];
    historicalDataList.push({"stockName": stockName});
    if(getRequests == 0){ //when we have finished all our requests..
        drawGraph(context); //..we execute the drawGraph
    }
}
function drawGraph(context){

    loader.style.display = "none"; //hide the loading spinner and overlay
    loaderOverlay.style.display = "none";

    var dateList = [];
    var valueList = [];
    var stockNameList = [];

    historicalDataList.reverse();
    
    for(var i = 0; i<historicalDataList.length; i++){
        for(var key in historicalDataList[i]){
            if(key == "stockName"){
                stockNameList.push({"stockName" : historicalDataList[i]["stockName"], "startIndex": i+1});
                continue; //we end the current iteration because we received a new stock value
            }
        }
        var date = historicalDataList[i]["date"];
        var value = historicalDataList[i]["value"];
        dateList.push(date);
        valueList.push(value);
    }
    console.log(stockNameList);
	
	
    //use jquery to remove duplicates in the dateList. 
    var uniqueDates = [];
    $.each(dateList, function(i, el){
        if($.inArray(el, uniqueDates) === -1){
            uniqueDates.push(el);
        }
    });

    var dataSet = []; //we need to compose our dataset before we send it to the chart constructor.
	var colors = ["red", "blue", "green", "black", "yellow", "purple"];
    for (var i = 0; i<stockNameList.length; i++){ //for every stock, construct a data array
		if(stockNameList.length == i + 1){
			var stockValues = valueList.splice(stockNameList[i]["startIndex"],valueList.length-1);
		}
		else{
			var stockValues = valueList.splice(stockNameList[i]["startIndex"],stockNameList[i+1]["startIndex"]);		
		}
		var randomColor = colors[Math.floor(Math.random() * colors.length)]; //choose a random color and remove it
		var index = colors.indexOf(randomColor);
		colors.splice(index, 1);
		var stockInfo = {
			label : stockNameList[i]["stockName"],
			radius: 0, // radius is 0 for only this dataset
            backgroundColor: randomColor,
            borderColor: randomColor,
            data: stockValues,
            fill: false,
		};	
		dataSet.push(stockInfo);
		console.log(dataSet);
    }

    var portfolioName = context.parentNode.parentNode.childNodes[0].childNodes[0].innerHTML;
    
    //draw the graph based on the stocks
    var performanceDiv = document.getElementById("performanceDiv");
    document.getElementById("overlay").style.display = "block"; //make the overlay and canvas visible
    performanceDiv.style.display = "block";

    var dateDiv = document.createElement("div");

    var canvas = document.createElement("canvas"); //create the canvas
    canvas.id = "graphCanvas";


    var today = new Date(); //max date is today
    var day = today.getDate();
    var month = today.getMonth() + 1; 
    var year = today.getFullYear();

    if(day < 10){
        day = '0' + day;
    }
    if (month < 10){
        month = '0' + month;
    }
    today = year + "-" + month + "-" + day;

    var startDate = document.createElement("input"); //create start and end date inputs
    startDate.setAttribute("type", "date");
    startDate.setAttribute("min", "2000-01-03"); //the alphavantage API limits the data to this date
    startDate.id = "startDate";

    var endDate = document.createElement("input");
    endDate.setAttribute("type", "date");
    endDate.setAttribute("value", today);
    endDate.setAttribute("max", today); //maximum value is today's date
    endDate.id = "endDate";

    var adjustButton = document.createElement("button");
    adjustButton.id= "adjustButton";
    adjustButton.innerHTML = "Adjust time window";


    dateDiv.appendChild(startDate);
    dateDiv.appendChild(endDate);
    dateDiv.appendChild(adjustButton);
    
    performanceDiv.appendChild(canvas); //append canvas and inputs
    performanceDiv.appendChild(dateDiv);


    var myChart = new Chart(canvas, { //draw chart
        type: 'line',
        data: {
            labels: uniqueDates,
            datasets: dataSet, /* [{
                label: stockNameList[0]["stockName"],
                radius: 0, // radius is 0 for only this dataset
                backgroundColor: 'rgb(220,20,60)',
                borderColor: 'rgb(220,20,60)',
                data: valueList,
                fill: false,
            }, {
                label: "Aapl",
                backgroundColor: 'rgb(0,191,255)',
                borderColor: 'rgb(0,191,255)',
                data: [
                    23,35,87,21,2,1,5
                ],
                fill: false,
            }]*/
        },
        options: {
            responsive: true,
            title:{
                display:true,
                text:'Historic valuation of the stocks in ' + portfolioName,
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Stock value'
                    }
                }]
            }
        }
    });
    //adjustButton.addEventListener("click", updateChart); //we add the event listener to the button
}

function updateChart(){ //if the user chooses to update the chart, we adjust the time window according to the choices the user made.
    alert("hi");
}
function refreshStocks(){ //refresh all the stock values, which means we have to make an API request for every stock in the portfolio.
    loader = document.getElementById("loader"); //initiate loading sign and overlay
    loaderOverlay = document.getElementById("loaderOverlay");

    loader.style.display = "block";
    loaderOverlay.style.display = "block";

    var context = this;
    var middleDiv = context.parentNode.parentNode.childNodes[1];
    var table = middleDiv.childNodes[0];
    var tableLength = table.rows.length;

    if(tableLength == 1){
        alert("You do not have any stocks to refresh. Please add a stock.");
        return;
    }

    var stockNameCell = 0;

    for (var i = 1; i<tableLength; i++){ //for every stock, update the unit value and total value
        var refreshStockName = table.getElementsByTagName("td")[stockNameCell].innerText;
        getRequest("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + refreshStockName + "&interval=1min&apikey=VV6I5M93ATB8Z7JW", refreshCallback, context); //send the context further
        stockNameCell += 5;
    }

}
function refreshCallback(data, context){
    //set the correct currency

    var topDiv = context.parentNode.parentNode.childNodes[0]; 
    var showEurosButton = topDiv.childNodes[1];
    var showDollarsButton = topDiv.childNodes[2];
    var currency;
    
    if(showEurosButton.disabled){ //if the eurobutton is disabled, it means that the current currency is euros
        currency = "€";
    }
    else{
        currency = "$";
    }

    var requestStockName = data["Meta Data"]["2. Symbol"];

    var unitKeys = Object.keys(data["Time Series (1min)"]); //find the keys
    var recentKey = unitKeys[0]; //the first key has the most recent stock close value.
    var unitValue = data["Time Series (1min)"][recentKey]["4. close"]; //the newest unit value
    unitValue = Math.round(parseFloat(unitValue) * 100) / 100;



    if(showEurosButton.disabled){ // in this case, euros are chosen. We use the latest rate which we got when we clicked on the "show in €" or "Refresh exchange rate" button.
        unitValue = Math.round(unitValue * parseFloat(usdToEurRate) * 100) / 100;
    }

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
        stockNameCell += 5;
    }
    updateTotalValue(context); //update the total value
}
function removeSelected(){
    var table = this.parentNode.parentNode.childNodes[1].childNodes[0]; // get the table from the DOM tree
    var checkBoxes = table.getElementsByTagName("input"); //get the checkbox list
    var selectedBoxes = false;
    var context = this;

    for (var i = 0; i < checkBoxes.length; i++){ //loop through the table checkboxes to find which ones are selected
        if (checkBoxes[i].checked){ 
            selectedBoxes = true;
        }
    }
    if(selectedBoxes == false){
        alert("You have not selected any stocks in this portfolio.");
        return;
    }
    if(confirm("Are you sure you want to remove selected stocks?")){
        for (var i = 0; i < checkBoxes.length; i++){ //loop through the table checkboxes to find which ones are selected

            if (checkBoxes[i].checked){ //if a row is selected, delete row and decrease length by 1.
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
    
    var loader = document.getElementById("loader"); //we want to hide the loading spinner
    var loaderOverlay = document.getElementById("loaderOverlay");

    //set the correct currency 
    var topDiv = context.parentNode.parentNode.childNodes[0]; 
    var showEurosButton = topDiv.childNodes[1];
    var showDollarsButton = topDiv.childNodes[2];
    
    var currency;
    
    if(showEurosButton.disabled){ //if the eurobutton is disabled, it means that the current currency is euros
        currency = "€";
    }
    else{
        currency = "$";
    }

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

    loader.style.display = "none"; //hide loader
    loaderOverlay.style.display = "none";

}
