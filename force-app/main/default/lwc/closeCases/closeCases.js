import { LightningElement, wire } from 'lwc';
import getClosedCases from '@salesforce/apex/CloseCaseController.getClosedCases';

export default class CloseCases extends LightningElement {

    _errors;
    _cases;

    @wire(getClosedCases)
    wiredData({ error, data }) {
      if (data) {
        console.log('Data', data);
        this._cases = JSON.parse(JSON.stringify(data));
      } else if (error) {
        console.error('Error:', error);
      }
    }

    handleClick = event =>{
        event.preventDefault();
        alert(JSON.stringify(this._cases));
    }

    handleCheckbox = event =>{
      event.preventDefault();
      let name = event.target.name;
      let checked = event.target.checked;
      let index = event.target.dataset.recordId;
      console.log(index +' '+name+' '+checked);
      console.log(this._cases[index][name]);

      this._cases[index][name] = checked;
      console.log(this._cases[index][name]);

    }
    
}