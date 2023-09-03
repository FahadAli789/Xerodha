const SEVEN_HOURS=2.52e+7;
async function processData(data){
    const sortedByDateOrdersData= sortOrdersInMapDateWise(createMapOfOrders(data));
    console.log('The Map is ',sortedByDateOrdersData);
    const settledStockOrdersByName= iterateOverValuesToSettleBuyAndSellTrades(sortedByDateOrdersData);
    const currentDateTime = new Date();
    const stockPriceData= await fetchPriceOfStocks();
    return generateStockHoldingData(settledStockOrdersByName,stockPriceData);
    
}
const createMapOfOrders = (data)=>{
    const mapOfOrders = new Map();
    data.forEach((element)=>{
        const tradeOrder=transformDataIntoTradeOrder(element);
        if(mapOfOrders.has(tradeOrder.Symbol)){
            mapOfOrders.set(tradeOrder.Symbol, [...mapOfOrders.get(tradeOrder.Symbol),tradeOrder]);
        }
        else{
            if(tradeOrder.Symbol){
            mapOfOrders.set(tradeOrder.Symbol,[tradeOrder]);
            }
        }
    })
    return mapOfOrders;
}
const sortOrdersInMapDateWise = (mapOfOrders)=>{
    mapOfOrders.forEach((value,key)=>{
        value.sort((order1,order2)=> order1-order2)
        value.sort((order1,order2)=>{
            if(Math.abs(order1.TradeDateTime-order2.TradeDateTime)<SEVEN_HOURS && order1.TradeType!==order2.TradeType){
              return order1.TradeType.localeCompare(order2.TradeType);
            }
            return 0;
          });
    })
    return mapOfOrders;
}
const transformDataIntoTradeOrder=(element)=>{
    return {
        Symbol:element.symbol,
        TradeType:element.trade_type,
        TradeDateTime:new Date(element.order_execution_time),
        Price:parseFloat(element.price),
        Quantity:parseInt(element.quantity)
    }
}
const iterateOverValuesToSettleBuyAndSellTrades = (sortedByDateOrdersMap) =>{
    const settledStockOrdersByName= new Map();
    sortedByDateOrdersMap.forEach((value,key)=>{
        if(key==='CLEAN'){
            console.log('Test');
        }
        settledStockOrdersByName.set(key,settleBuyAndSellTradesInArray([...value])); 
    })
    return settledStockOrdersByName;
}
const settleBuyAndSellTradesInArray = (ordersArray)=>{
    for(let i=0,j=0;i<ordersArray.length;++i){
        if(ordersArray[i].TradeType==='sell'){
            while(!(ordersArray[j].TradeType==='buy' && Math.abs(ordersArray[j].TradeDateTime-ordersArray[i].TradeDateTime)<SEVEN_HOURS)&&j<i){
                j++;
            }
            if(ordersArray[j].TradeType==='buy' && Math.abs(ordersArray[j].TradeDateTime-ordersArray[i].TradeDateTime)<SEVEN_HOURS){
                if(ordersArray[j].Quantity<ordersArray[i].Quantity){
                    ordersArray[i].Quantity-=ordersArray[j].Quantity;
                    ordersArray[j].Quantity=0;
                    ordersArray[j].TradeType='settled';
                    i--;
                }
                else{
                    ordersArray[j].Quantity-=ordersArray[i].Quantity
                    ordersArray[i].Quantity=0;
                    ordersArray[i].TradeType='settled';
                    if(ordersArray[j].Quantity===0){
                        ordersArray[j].TradeType='settled';
                    }
                }
            }
        }
    }
    for(let i=0,j=0;i<ordersArray.length;++i){
        if(ordersArray[i].TradeType==='sell'){
            let quantity=ordersArray[i].Quantity;
            while(ordersArray[j].Quantity-quantity<0){
                quantity-=ordersArray[j].Quantity;
                ordersArray[j].Quantity=0;
                ordersArray[j].TradeType='settled'
                j++;
                while(j<=i && ordersArray[j].TradeType!='buy'){
                    j++;
                }
            }
            ordersArray[j].Quantity-=quantity;
            if(ordersArray[j].Quantity===0){
                ordersArray[j].TradeType='settled';
            }
            ordersArray[i].Quantity=0;
            ordersArray[i].TradeType='settled';
        }
    }
    return ordersArray.filter((element)=> element.TradeType!='settled');
}
async function fetchPriceOfStocks(){
    const stockPriceData= new Map();
    await fetch('https://64607244fe8d6fb29e30eaaf.mockapi.io/Xerodha/V1/StockPriceData')
        .then(response => response.json())
        .then(data => data.forEach(element =>{
        stockPriceData.set(element.StockName,element.StockPrice);
        }))
        console.log(stockPriceData);
        return stockPriceData;
}
const generateStockHoldingData = (settledStockOrdersByName,stockPriceData)=>{
    const stockHoldingData=[];
    settledStockOrdersByName.forEach((value,key)=>{
        if(value.length>0 && stockPriceData.has(key)){
            stockHoldingData.push(combineSettledTradeOrdersIntoStockHolding(value,stockPriceData.get(key)));
        }
    })
    return stockHoldingData;
}
const combineSettledTradeOrdersIntoStockHolding = (settledStockOrders,currentPrice) => {
    const stockHolding={};
    stockHolding.currentPrice=currentPrice;
    stockHolding.quantity=0;
    stockHolding.totalPrice=0;
    stockHolding.inflationAdjustedtotalPrice=0;
    stockHolding.Name=settledStockOrders[0].Symbol;
    settledStockOrders.forEach(stockOrder =>{
        stockHolding.quantity+=stockOrder.Quantity;
        stockHolding.totalPrice+=stockOrder.Price*stockOrder.Quantity;
        let stockOrder_inflationAdjustedBuyPrice=calculateInflationPercentage(stockOrder.TradeDateTime)*stockOrder.Price;
        stockHolding.inflationAdjustedtotalPrice+=stockOrder_inflationAdjustedBuyPrice*stockOrder.Quantity;
    })
    stockHolding.avgPrice=stockHolding.totalPrice/stockHolding.quantity;
    stockHolding.currentValue=stockHolding.currentPrice*stockHolding.quantity ;
    stockHolding.profitOrLoss=stockHolding.currentValue-stockHolding.totalPrice;
    stockHolding.netChange=((stockHolding.currentPrice-stockHolding.avgPrice)/(stockHolding.avgPrice));
    stockHolding.profitLossColor=(stockHolding.currentPrice>stockHolding.avgPrice)?"slds-text-color_success":"slds-text-color_error";
    stockHolding.inflationAdjustedAvgPrice=stockHolding.inflationAdjustedtotalPrice/stockHolding.quantity;
    stockHolding.inflationAdjustedprofitOrLoss=stockHolding.currentValue-stockHolding.inflationAdjustedtotalPrice;
    stockHolding.inflationAdjustedNetChange=(stockHolding.currentPrice-stockHolding.inflationAdjustedAvgPrice)/(stockHolding.inflationAdjustedAvgPrice);
    return stockHolding;
}
const calculateInflationPercentage =(date)=>{
    const DAY_TO_MILLISECONDS= 1000*60*60*24;
    const YEAR_TO_DAY=365;
    const INFLATION_RATE_PER_YEAR= 0.07;
    let dateOfTranscation =new Date(date);
    let dateToday= new Date();
    let  daysFromTransaction=(dateToday-dateOfTranscation)/DAY_TO_MILLISECONDS;
    return(1+INFLATION_RATE_PER_YEAR)**(daysFromTransaction/YEAR_TO_DAY);
}

export{processData}    
    
