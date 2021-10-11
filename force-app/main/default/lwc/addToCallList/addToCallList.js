import { LightningElement, wire, track } from 'lwc';
import getData from '@salesforce/apex/getRecords.getData';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import CONTACT_ID_FIELD from '@salesforce/schema/Contact.Id';
import CONTACT_ADDED_TO_CALL_LIST from '@salesforce/schema/Contact.Added_to_Call_List__c';
import ACCOUNT_ID_FIELD from '@salesforce/schema/Account.Id';
import ACCOUNT_ADDED_TO_CALL_LIST from '@salesforce/schema/Account.Added_to_Call_List__c';
import LEAD_ID_FIELD from '@salesforce/schema/Lead.Id';
import LEAD_ADDED_TO_CALL_LIST from '@salesforce/schema/Lead.Added_to_Call_List__c';

const columnsContact = [{label: 'Name', fieldName: 'Name', type: 'text', editable: true, sortable: true},
                 {label: 'Organization', fieldName: 'accountName', type: 'text'},
                 {label: 'Email', fieldName: 'Email', type: 'email'},
                 {label: 'Phone', fieldName: 'Phone', type: 'phone'},
                 {label: 'Add', type: 'button-icon', initialWidth: 20, typeAttributes: {
                                                                                            iconName: 'utility:add',
                                                                                            title: 'Add',
                                                                                            name: 'Add',
                                                                                            value: 'Add',
                                                                                            variant: 'neautral',
                                                                                            class: 'scaled-down'
                                                                                        }},
                ];
const columnsAccount = [{label: 'Name', fieldName: 'Name', type: 'text'},
                 {label: 'Type', fieldName: 'Type', type: 'text'},
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
const columnsLead =   [{label: 'Name', fieldName: 'Name', type: 'text'},
                {label: 'Email', fieldName: 'Email', type: 'email'},
                {label: 'Company', fieldName: 'Company', type: 'text'},
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
    @track columns = columnsContact;
    @track initialRecords;
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
    wiredData( result ){
        this.wiredResult = result;

        const { data,error } = result;
        if( data ){
            this.data = data;
            console.log(JSON.stringify(this.data));
            //console.log(this.value);
            
            let dataAssets = [];
            this.data.forEach(function (asset){
                let dataAsset = {};
                dataAsset.id = asset.Id;
                dataAsset.Name = asset.Name;
                dataAsset.Company = asset.Company;
                if(asset.Type){dataAsset.Type = asset.Type;}
                if(asset.Account){ dataAsset.accountName = asset.Account.Name; }
                dataAsset.Email = asset.Email;
                dataAsset.Phone = asset.Phone;
                dataAsset.buttonName = 'Add';
                dataAssets.push(dataAsset);
            });
            this.data = dataAssets;
            this.initialRecords = this.data;
        }
        if( error ){
            this.errors = error;
            this.initialRecords = undefined;
        }
    }

    handleChange(e){
        this.value = e.target.value;
        if(this.value === 'Account'){
            this.columns = columnsAccount;
        }
        if(this.value === 'Contact'){
            this.columns = columnsContact;
        }
        if(this.value === 'Lead'){
            this.columns = columnsLead;
        }
    }
    handleKeyChange( event ) {  
        const searchKey = event.target.value.toLowerCase();  
        console.log( `Search Key is  + ${searchKey}` );
        if ( searchKey ) {  
            console.log( `Search Key is  + 112 ${searchKey}` );
            this.data = this.initialRecords;
             if ( this.data ) {
            console.log( `Search Key is  + 112 ${searchKey}` );
                let recs = [];
                for ( let rec of this.data ) {
                    console.log( 'Rec is ' + rec );
                    console.log( 'Rec is ' + JSON.stringify( rec ) );
                    let valuesArray = Object.values( rec );
                    console.log( 'valuesArray is ' + valuesArray );
                    for ( let val of valuesArray ) {
                        if( val == '[object Object]' ){
                            val = JSON.stringify(val);
                        }
                        if ( val ) {
                            if ( val.toLowerCase().includes( searchKey ) ) {

                                recs.push( rec );
                                break;
                        
                            }

                        }
                    }
                }

                console.log( 'Recs are tested ' + JSON.stringify( recs ) );
                this.data = recs;

             }
 
        }  else {
            this.data = this.initialRecords;
        }
    }  

    addToList(event){
        console.log(event.detail.row.id);
        const fields = {};
        console.log(this.value);
        if(this.value === 'Contact'){
            fields[CONTACT_ID_FIELD.fieldApiName] = event.detail.row.id;
            fields[CONTACT_ADDED_TO_CALL_LIST.fieldApiName] = true;
        }
        else if(this.value === 'Lead'){
            fields[LEAD_ID_FIELD.fieldApiName] = event.detail.row.id;
            fields[LEAD_ADDED_TO_CALL_LIST.fieldApiName] = true;
        }
        else if(this.value === 'Account'){
            fields[ACCOUNT_ID_FIELD.fieldApiName] = event.detail.row.id;
            fields[ACCOUNT_ADDED_TO_CALL_LIST.fieldApiName] = true;
        }

        const recordInput = { fields };
        updateRecord( recordInput )
            .then( () => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title : 'Success!! Added to call list',
                        message : 'updated',
                        variant : 'success'
                    })
                );
                return refreshApex(this.wiredResult);
            })
            .catch( error => {
                console.log(JSON.stringify(error.body));
                this.dispatchEvent(
                    new ShowToastEvent({
                        title : 'Error ',
                        message : error.body.message,
                        variant : 'error'
                    })
                );
            });
    }
}