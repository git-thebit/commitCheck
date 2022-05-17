import { LightningElement, wire, track } from 'lwc';
import fetchAccounts from '@salesforce/apex/dataHelper.fetchContacts';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ID_FIELD from '@salesforce/schema/Contact.Id';
import ADDED_TO_CALL_LIST from '@salesforce/schema/Contact.Added_to_Call_List__c';
import { NavigationMixin} from "lightning/navigation";

/* const columns = [
    { label: 'Name', fieldName: 'name', editable: true },
    { label: 'Organization', fieldName: 'Account', type: 'text', editable: true },
    { label: 'Email', fieldName: 'email', type: 'email', editable: true },
    { label: 'Telephone', fieldName: 'telephone', type: 'phone', editable: true },
    { label: 'Last Active', fieldName: 'Last Active', type: 'Date', editable: true },
    { label: 'Add to Call List', fieldName: 'Add to Call List', type: 'checkbox', editable: true},
]; */

export default class CallList extends NavigationMixin(LightningElement) {

    value = 'Contact';
    headers = ['Name', 'Organization', 'Email', 'Phone'];
    @track records;
    sortedColumn;
    sortedDirection = 'asc';
    initialRecords;
    accountSelect = true;

    navigate() {
        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                actionName: "view",
                recordId: "0015g000003XAX1AAO"
            }
        });
    }

    addToList(event) {
        const fields = {};
        console.log(event.target.id.split('-')[0]);
        // const fields = { 'recordid' : event.target.id.split('-')[0], 'Added_to_Call_List__c' : true };
        // const recordInput = {apiName : 'Contact', fields};
        fields[ID_FIELD.fieldApiName] = event.target.id.split('-')[0];
        fields[ADDED_TO_CALL_LIST.fieldApiName] = true;

        const recordInput = { fields };
        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success!! Added to call list',
                        message: 'updated',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                console.log(JSON.stringify(error.body));
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error ',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });


    }

    @wire(fetchAccounts)
    wiredAccount({ error, data }) {
        if (data) {

            this.records = data;
            this.initialRecords = data;
            this.error = undefined;

        } else if (error) {

            this.error = error;
            this.initialRecords = undefined;
            this.records = undefined;

        }
    }

    sortRecs(event) {

        let colName = event.target.name;
        console.log('Column Name is ' + colName);
        if (this.sortedColumn === colName) {
            this.sortedDirection = (this.sortedDirection === 'asc' ? 'desc' : 'asc');
        }
        else {
            this.sortedDirection = 'asc';
        }

        let isReverse = this.sortedDirection === 'asc' ? 1 : -1;

        this.sortedColumn = colName;

        // sort the data
        this.records = JSON.parse(JSON.stringify(this.records)).sort((a, b) => {
            a = a[colName] ? a[colName].toLowerCase() : ''; // Handle null values
            b = b[colName] ? b[colName].toLowerCase() : '';
            return a > b ? 1 * isReverse : -1 * isReverse;
        });;

    }

    handleKeyChange(event) {

        const searchKey = event.target.value.toLowerCase();
        console.log(`Search Key is  + ${searchKey}`);
        if (searchKey) {

            this.records = this.initialRecords;

            if (this.records) {

                let recs = [];
                for (let rec of this.records) {
                    console.log('Rec is ' + rec);
                    console.log('Rec is ' + JSON.stringify(rec));
                    let valuesArray = Object.values(rec);
                    console.log('valuesArray is ' + valuesArray);

                    for (let val of valuesArray) {
                        if (val == '[object Object]') {
                            val = JSON.stringify(val);
                        }
                        if (val) {
                            if (val.toLowerCase().includes(searchKey)) {

                                recs.push(rec);
                                break;

                            }

                        }

                    }

                }

                console.log('Recs are ' + JSON.stringify(recs));
                this.records = recs;

            }

        } else {

            this.records = this.initialRecords;

        }

    }

    data = [];
    //columns = columns;
    rowOffset = 0;

    get options() {
        return [
            { label: 'Lead', value: 'Lead' },
            { label: 'Contact', value: 'Contact' },
            { label: 'Organization', value: 'Account' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;

        if (this.value === 'Account') {
            this.headers = ['Organization Name', 'Email', 'Phone'];
            console.log(this.value);
            this.accountSelect = false;
        }
        else {
            this.accountSelect = true;
            this.headers = ['Name', 'Organization', 'Email', 'Phone'];
        }
    }
}