import { LightningElement, wire, track } from 'lwc';
import getData from '@salesforce/apex/getRecords.getData';

const columns = [{label: 'Name', fieldName: 'Name', type: 'text', editable: true, sortable: true},
                 {label: 'Organization', fieldName: 'accountName', type: 'text'},
                 {label: 'Email', fieldName: 'Email', type: 'email'},
                 {label: 'Phone', fieldName: 'Phone', type: 'phone'},
                 {label: 'Add', type: 'button-icon', initialWidth: 20, typeAttributes: {
                                                                                            iconName: 'utility:add',
                                                                                            title: 'Add',
                                                                                            name: 'Add',
                                                                                            value: 'Add',
                                                                                            variant: 'destructive-text',
                                                                                            class: 'scaled-down'
                                                                                        }},
                ];
export default class AddToCallList extends LightningElement {
    value = 'Contact';
    columns = columns;
    get options() {
        return [
            { label: 'Lead', value: 'Lead' },
            { label: 'Contact', value: 'Contact' },
            { label: 'Organization', value: 'Account' },
        ];
    }
    @track data = [];
    errors;  
    @wire( getData, {objectType: '$value'} )
    wiredData( {error,data} ){
        if( data ){
            this.data = data;
            console.log(JSON.stringify(this.data));
            
            let dataAssets = [];
            this.data.forEach(function (asset){
                let dataAsset = {};
                dataAsset.id = asset.Id;
                dataAsset.Name = asset.Name;
                dataAsset.accountName = asset.Account.Name;
                dataAsset.Email = asset.Email;
                dataAsset.Phone = asset.Phone;
                dataAsset.buttonName = 'Add';
                dataAssets.push(dataAsset);
            });
            this.data = dataAssets;
        }
        if( error ){
            this.errors = error;
        }
    }
    handleRowAction(e){
        console.log(e.detail.row.id);
    }
    handleChange(e){
        this.value = e.target.value;
        console.log(this.value);
    }
    handleKeyChange(event){
        console.log(event.target.value);
    }
}