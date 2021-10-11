import { LightningElement, track, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import getSingleContact from '@salesforce/apex/ContactController.getSingleContact';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import ID_FIELD from '@salesforce/schema/Contact.Id';

export default class LdsUpdateRecord extends LightningElement {
    disabled = false;
    @track error;
    @api recordId;

    @wire(getSingleContact)
    contact;

    handleChange(event) {
         // Display field-level errors and disable button if a name field is empty.
        if (!event.target.value) {
            event.target.reportValidity();
            this.disabled = true;
        }
        else {
            this.disabled = false;
        }
    }

    updateContact() {
        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputFields) => {
                inputFields.reportValidity();
                return validSoFar && inputFields.checkValidity();
            }, true);

        if (allValid) {
            // Create the recordInput object
            console.log('Test');
            const fields = {};
            fields[ID_FIELD.fieldApiName] = this.contact.data.Id;
            fields[FIRSTNAME_FIELD.fieldApiName] = this.template.querySelector("[data-field='FirstName']").value;
            fields[LASTNAME_FIELD.fieldApiName] = this.template.querySelector("[data-field='LastName']").value;

            const recordInput = { fields };
            console.log('Test 2');
            console.log(recordInput);

            updateRecord(recordInput)
                .then(() => {
            console.log('Test 3');

                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Contact updated',
                            variant: 'success'
                        })
                    );
                    // Display fresh data in the form
                    //return refreshApex(this.contact);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
            }
        else {
            // The form is not valid
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Something is wrong',
                    message: 'Check your input and try again.',
                    variant: 'error'
                })
             );
        }
    }
}