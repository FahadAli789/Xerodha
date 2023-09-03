import { LightningElement } from 'lwc';
import {processData} from'c/stockDataProcessor';
import {COLUMNS} from './stockHoldingDataTable'
export default class StockHoldingMain extends LightningElement {
    stockHoldingData=[];
    columns=COLUMNS;
    showMenu=true;
    connectedCallback(){
        const currentDateTime = new Date();
        console.log('Before Time ',currentDateTime);
    }
    async receiveData(event){
        this.stockHoldingData= await processData(event.detail.data);
        console.log('The stock holding data is',JSON.stringify(this.stockHoldingData));
        this.showMenu=false;
    }

}