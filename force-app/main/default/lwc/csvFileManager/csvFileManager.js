import { LightningElement,track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {parse} from './csvParse'
import {SUCCESS_MESSAGE,SUCCESS_VARIANT,SUCESS_TITLE} from './constants';

export default class CsvFileManager extends LightningElement {
    fileName = [];
    @track columns = [];
    @track data = [];
    async handleCSVUpload(event) {
        const files = event.detail.files;
        if (files.length > 0) {
          for(let i=0;i<files.length;++i){
            const file = files[i];
            this.fileName.push(file.name);
            await this.read(file);
            if(i===files.length-1){
            console.log('--> Data operations over');
            this.notifyDataOperationsOver();
            }
          }  
        }
      }
    async read(file) {
    try {
    const result = await this.load(file);
    this.data=[...this.data,...parse(result)];
    } catch (e) {
        console.error('There was an error in processing the error is : ',e);
    }
    }
    async load(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
        resolve(reader.result);
        };
        reader.onerror = () => {
        reject(reader.error);
        };
        reader.readAsText(file);
    });
    }

    notifyDataOperationsOver(){
        this.dispatchEvent(new ShowToastEvent({
            title:SUCESS_TITLE,
            message:SUCCESS_MESSAGE,
            variant:SUCCESS_VARIANT
        }));
        this.dispatchEvent(new CustomEvent('dataready',{
            detail: {
                data: this.data
            }
        }));
    }
}