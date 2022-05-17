import { LightningElement } from 'lwc';
 
import getTextMethod1 from '@salesforce/apex/asy.getTextMethod1';
import getTextMethod2 from '@salesforce/apex/asy.getTextMethod2';
import getTextMethod3 from '@salesforce/apex/asy.getTextMethod3';
import getContactDetails from '@salesforce/apex/asy.getContactDetails';
 
export default class LwcPromise extends LightningElement {
 
    connectedCallback() {
        this.invokeApexMethods();
    }
    results = 'test';
    async invokeApexMethods() {
        try {
            const con = await getContactDetails({ account: 'Burlington Textiles Corp of America', name: 'Jack Rogers'});
            console.log(JSON.stringify(con));

            const result1 = await getTextMethod1();
            console.log('Method1 result: ' + result1);

            const result2 = await getTextMethod2({
                message1: result1
            });
            console.log('Method2 result: ' + result2);

            const result3 = await getTextMethod3({
                message2: result2
            });
            console.log('Method3 result: ' + result3);

        } catch(error) {
            console.log(error);
        } finally {
            console.log('Finally Block');
        }
    }
}