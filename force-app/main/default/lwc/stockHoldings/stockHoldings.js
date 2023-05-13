import { wire,LightningElement,track } from 'lwc';
import getStockOrders from'@salesforce/apex/HoldingController.retriveStockOrders';
const COLUMNS=[
    { label: 'Instrument', fieldName: 'Name' },
    { label: 'Qty', fieldName: 'quantity', type: 'number' },
    { label: 'Avg. cost', fieldName: 'avgPrice', type: 'currency' },
    { label: 'LTP', fieldName: 'CurrentPrice', type: 'currency' },
    { label: 'Curr. val', fieldName: 'currentValue', type: 'currency' },
    { label: 'P&L', fieldName: 'profitOrLoss', type: 'currency',
    cellAttributes:{
        class: { fieldName: 'profitLossColor'}
        }
    },
    { label: 'Net change', fieldName:'netChange',type:'percent',
        typeAttributes: { 
            step: '0.01', minimumFractionDigits: '2', maximumFractionDigits: '2'
        },
    cellAttributes:{
        class: { fieldName: 'profitLossColor'}
        }
    }
];


export default class StockHoldings extends LightningElement {
    defaultId='a009D000005dJ1HQAU'
    HoldingIds=[this.defaultId];
    StockOrders=[];
    columns=COLUMNS;
    @track Stocks=[];
    total_Invesment=0;
    total_CurrentValue=0;
    total_ProfitOrLoss=0;

    @wire(getStockOrders, {holdingIds: '$HoldingIds'})
    StockOrders({data}){
        if(data){
            this.StockOrders=data;
            console.log('The wire data is ',this.StockOrders);
            this.populateStockDataFromOrders();
            this.calculateStockData();
            console.log('after calculation of stock price',JSON.stringify(this.Stocks));
        }
    };
    populateStockDataFromOrders(){
        console.log('In the populateStockDataFromOrders ');
        let Stocks=[];
        let StockOrders=this.StockOrders;
        for(let stockOrder of StockOrders){
            console.log('StockOrder : ',stockOrder);
             if(Stocks.length<1 || Stocks.findIndex(stock => stock.Name === stockOrder.Stock__r.Name)<0){
                let stockOrdersGroupedByStock=[stockOrder];
                let stock = {
                    Name: stockOrder.Stock__r.Name,
                    StockOrders: stockOrdersGroupedByStock,
                    CurrentPrice: stockOrder.Stock__r.Sell_Price__c
                };
                Stocks.push(stock);
             }
            else{
                let index=Stocks.findIndex((stock) => stock.Name === stockOrder.Stock__r.Name);
                console.log('index ',index);
                Stocks[index].StockOrders.push(stockOrder);
            }
        }
        this.Stocks=Stocks;
        console.log('after Population ',JSON.stringify(this.Stocks));
    }
    calculateStockData(){
        console.log('In thecalculateStockData ');
        let total_Invesment=0;
        let total_CurrentValue=0;
        let total_ProfitOrLoss=0;
        this.Stocks.forEach(stock =>{
            stock.quantity=0;
            stock.totalPrice=0;
            stock.StockOrders.forEach(stockOrder => {
                stock.quantity+=stockOrder.Qty__c;
                stock.totalPrice+=stockOrder.Buy_Price__c*stockOrder.Qty__c;
            })
            stock.avgPrice=stock.totalPrice/stock.quantity;
            stock.currentValue=stock.CurrentPrice*stock.quantity ;
            stock.profitOrLoss=stock.currentValue-stock.totalPrice;
            stock.netChange=((stock.CurrentPrice-stock.avgPrice)/(stock.avgPrice));
            stock.profitLossColor=(stock.CurrentPrice>stock.avgPrice)? "slds-text-color_error":"slds-text-color_success";
            total_Invesment+=stock.totalPrice;
            total_CurrentValue+=stock.currentValue;
            total_ProfitOrLoss+=stock.profitOrLoss;           
        })
        this.total_Invesment=total_Invesment;
        this.total_CurrentValue=total_CurrentValue;
        this.total_ProfitOrLoss=total_ProfitOrLoss;
    }

}