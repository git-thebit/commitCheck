import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const showMessage = (page, t, m,type ) => {
    const toastEvt = new ShowToastEvent({
        title: t,
        message:m,
        variant: type
    });
    page.dispatchEvent(toastEvt);
};
const arrayContainsValue=(arr, key, val)=> {
        var records=[];
        for (var i = 0; i < arr.length; i++) {
            if(arr[i][key].includes(val)) 
            {
                records.push(arr[i]);
            }            
        }
        return records;
}
    
const findRowIndexById=(data,id)=>{
        let ret = -1;
        data.some((row, index) => {
          if (row.Id === id) {
            ret = index;
            return true;
          }
          return false;
        });
        return ret;
}
const isNotBlank=(checkString)=>{
    return (checkString !== '' && checkString !== null && checkString !== undefined);
}
export 
{
    showMessage,
    arrayContainsValue,
    findRowIndexById,
    isNotBlank
}