import { LightningElement, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import sharedjs from 'c/sharedjs';

const columns = [
    { label: 'Name', fieldName: 'Name', wrapText: 'true', sortable: true, editable: true },
    { label: 'Email', fieldName: 'Email', type: 'email', sortable: true, editable: true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone', sortable: true, editable: true },
    { label: 'Title', fieldName: 'Title', sortable: true, editable: true },
    {
        label: 'Account',
        fieldName: 'ACC_NAME',
        wrapText: 'true',
        cellAttributes: {
            iconName: { fieldName: 'accIconName' },
            iconPosition: 'left'
        },
        sortable: true
    },
    {
        label: 'Owner',
        fieldName: 'OWNER',
        cellAttributes: {
            iconName: { fieldName: 'iconName' },
            iconPosition: 'left'
        },
        sortable: true
    },

    {
        label: 'View',
        fieldName: 'URL',
        type: 'url',
        wrapText: 'true',
        typeAttributes: {
            tooltip: { fieldName: 'Name' },
            label: {
                fieldName: 'Name'
            },
            target: '_blank'
        }
    },
    { label: 'View', type:  'button', typeAttributes: { 
            label: 'View',  name: 'View',  variant: 'brand-outline',
            iconName: 'utility:preview', iconPosition: 'right'
        } 
    },
];
export default class ContactDataTable extends LightningElement {
    @track records;
    @track errors;
    columns = columns;

    connectedCallback() {
        this.handleDoInit();
    }
    handleDoInit() {
        sharedjs._servercall(
            getContacts,
            undefined,
            this.handleSuccess.bind(this),
            this.handleError.bind(this)
        );
    }

    handleSuccess(result) {
        result.forEach(element => {
            if (element.OwnerId) {
                element.OWNER = element.Owner.Name;
                element.iconName = 'standard:user';
            }
            if (element.AccountId) {
                element.ACC_NAME = element.Account.Name;
                element.accIconName = 'standard:account';
            }
            element.URL = 'https://' + window.location.host + '/' + element.Id;
        });
        this.records = result;
        this.errors = undefined;
    }
    handleError(error) {
        this.errors = error;
        this.records = undefined;
    }

    handleRowActions(event){
        window.console.log(' Row Level Action Handled ', event.detail.actionName);
        window.console.log(' Row Level Action Handled ', JSON.stringify(event.detail.data));
    }

    handlePagination(event){
        //window.console.log('Pagination Action Handled ', JSON.stringify(event.detail.records));
    }
}