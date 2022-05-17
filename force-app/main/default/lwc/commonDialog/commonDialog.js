import { LightningElement,track,api } from 'lwc';

export default class CommonDialog extends LightningElement {
    @track open = false;
    @api title='Test';
    @api 
    openmodal() {
        this.open = true
    }

    closeModal() {
        this.open = false
    } 
}