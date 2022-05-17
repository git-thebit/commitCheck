import { LightningElement, api, track } from 'lwc';
import getRecords from '@salesforce/apex/GenericDataSelector.getRecords';
import getCachedRecords from '@salesforce/apex/GenericDataSelector.getCachedRecords';
import apexExecute from '@salesforce/apex/DataRepository.execute';
import { showMessage,arrayContainsValue,isNotBlank,findRowIndexById} from 'c/commonLibrary';
import { deleteRecord } from 'lightning/uiRecordApi';

const action = [
    {   
        type:  'button-icon',
        initialWidth: 15,
        typeAttributes: {
            iconName: 'utility:edit',
            iconClass:'slds-var-m-left_xx-small',
            variant:'bare',
            name: 'edit',
            title: 'Edit Record', 
            disabled: false, 
            value: 'test'
        }
    },
    {   
        type:  'button-icon',
        initialWidth: 15,
        typeAttributes: {
            iconName: 'utility:delete',
            iconClass:'slds-m-left_xx-small',
            variant:'bare',
            name: 'delete', 
            title: 'Delete Record', 
            disabled: false, 
            value: 'test'
        }
    }];

export default class CommonDatatable extends LightningElement {
    @track action = action;
    @api records = [];
    @api sortable = false;
    @api editable = false;
    @api newDialogOnEditCreate = false;
    @api rowEditable = false;
    @track _selectedRows = [];
    @track tempSelectedRows = [];
    @api draftValues = [];
    @api objectName;
    @api whereCondition;
    @track error;
    @api sortBy = 'Id';
    @api showPagination = false;
    @api paginationSize=10;
    @api canDelete=false;
    @api enableFieldSearch=false;
    @api searchFields=[];
    @api apexName='';
    @api param={};
    @api hideCheckBox=false;
    @api hideRowNumber=false;
    @api saveBtnLabel='Save';
    @track _pageSize=10;
    @track sortedDirection='asc';
    @track draftValues=[];
    _startFromIndex = 0;
    _paginationInfo = {
        currentPage: 0,
        totalPages: 0
    };
    
    @track _columns = [];
    @track recordSelected=false;
    @track _hideCheckBox=false;
    @api _records = [];
    @track recordsInPage = [];
    @track cacheable = false;
    @api singleRowSelection = false;
    @track showSpinner=true;
    @track searchField='';
    @track tempRecords=[];
    @track recordId;
    @track title;
    connectedCallback() {
       this.init();
    }
  
    init=()=>{
      if(this.paginationSize==undefined || this.paginationSize!==10)
      {
          this.pageSize=this.paginationSize;
      }
      this.title='Edit ' + this.objectName;
      this.createActionButton();
      this.fetchRecordFromObject();
      this.fetchRecordFromApex();
      this.fetchRecordFromRecords();
    }
    createActionButton=()=>{
      if (this.columns != undefined && this.editable != undefined && this.editable) {
          this.columns = [...this.columns, this.action[0]];
      }
      if (this.columns != undefined && this.canDelete != undefined && this.canDelete) {
        this.columns = [...this.columns, this.action[1]];
      }
    }
    fetchRecordFromObject=()=>
    {
      if (this.objectName != undefined && this.columns != undefined) {
          this.fetchRecords();
      }
    }
    fetchRecordFromRecords=()=>
    {
      if (this.records != undefined && this.columns != undefined) {
          this.recordsInPage=this.records;
          this._records=this.records;
      }
    }
    fetchRecordFromApex=()=>
    {
      if (this.apexName !== '') {
          apexExecute({action:this.apexName,params:this.param})
          .then(result => {
              this.recordsInPage = result;
          })
          .catch(error => {
              this.error = error;
              console.log(JSON.stringify(error));
          });
  
      }
    }
  
      // invoked when column is changed
      @api
      get columns() {
         return this._columns;
      }
      set columns(value) {
          this._columns = value;
      }

      // invoked when selectedRows is changed
      @api
      get selectedRows() {
         return this._selectedRows;
      }
      set selectedRows(value) {
          this._selectedRows = value;
      }
    // invoked when page size is changed
    @api
    get pageSize() {
        if (!isNotBlank(this._pageSize)) this._pageSize = 10;
        return parseInt(this._pageSize, 10);
    }
    set pageSize(value) {
        this._pageSize = value;
    }
    
    
    get pageNumberInfo() {
          if (this._records && this._records.length > 0) {
            this._paginationInfo.currentPage = (((this._startFromIndex + 1) / this.pageSize) - (((this._startFromIndex + 1) % this.pageSize) / this.pageSize) + ((((this._startFromIndex + 1) % this.pageSize) === 0) ? 0 : 1));
            return 'Page ' + this._paginationInfo.currentPage + ' of ' + this._paginationInfo.totalPages;
        }
        return 'Page 0 of 0';
    }
    //PAGINATION - INVOKED WHEN PAGE SIZE IS CHANGED
  
    paginationRefresh = () => {
      this._startFromIndex = 0;
    }
  
    //PAGINATION - SHOW First PAGE
    showFirstPage = () => {
      this.paginationRefresh();
      this.processPagination();
  }
    //PAGINATION - SHOW PREVIOUS PAGE
    showPreviousPage(event) {
        if (this._startFromIndex > 0) {
            this._startFromIndex = this._startFromIndex - this.pageSize;
            this.processPagination();
        }
    }
  
    //PAGINATION - SHOW NEXT PAGE
    showNextPage(event) {
        if (this._startFromIndex + this.pageSize < this._records.length) {
            this._startFromIndex = this._startFromIndex + this.pageSize;
            this.processPagination();
        }
    }
  
  //PAGINATION - SHOW LAST PAGE
    showLastPage = (event) => {
        let result = this._records.length % this.pageSize;
        if (this._startFromIndex >= 0) {
            if (result === 0) {
                this._startFromIndex = this._records.length - this.pageSize;
                this.processPagination();
            } else {
                this._startFromIndex = this._records.length - result;
                this.processPagination(true, -result);
            }
        }
    }
  
    //Get object data
    fetchRecords() {
        return new Promise((resolve, reject) => {
        this.handleSpinner(true);
        let fields = this.getFields();
        if (fields) {
            this.sortBy = fields[0];
            fields = fields.join(',');
        }
        var field=fields;
        if(fields.slice(-1)===',')
        {
          field=fields.slice(0, -1);
        }
        const params = {
            objectName: this.objectName,
            fields: field,
            sortBy: this.sortBy,
            sortAsc: this.sortAsc,
            whereCondition: this.whereCondition,
            limitRecords: this.limit
        };
        if (this.cacheable) {
            getCachedRecords({params:params})
                  .then(map => resolve(this.getResolve(map.records)))
                  .catch(error => reject(this.getReject(error)));
        } else {
            getRecords({params:params})
            .then(map => resolve(this.getResolve(map.records)))
            .catch(error => {console.error(error)});
        } 
          });
    }
  
    //Search Fields according to columns list
    getFields = function() {
      var cols = [];
      if (this.columns) {
          this.columns.map((val) => {
              if (val.hasOwnProperty("fieldName")) {
                  cols.push(val["fieldName"]);
                  var field = {
                      "label" : val["label"],
                      "value" : val["fieldName"]
                  };  
                  this.searchFields.push(field);
              }
          });
      }
      return cols;
  }
  
  getResolve(records) {
        console.log('records:'+ JSON.stringify(records));
        this.error = undefined;
        this.processRecordsResult(records);
  }
  
    // process the records returned from database
    processRecordsResult(recordsListResult) {
       this.handleSpinner(false);
       this.recordsInPage=[];
       this.recordSelected=false;
       if (recordsListResult && recordsListResult.length > 0) 
       {
            this.records =  recordsListResult;
            this._records = recordsListResult
            if(this.showPagination)
            {
              this._paginationInfo.totalPages = (((this.records.length / this.pageSize) - ((this.records.length % this.pageSize) / this.pageSize)) + (((this.records.length % this.pageSize) === 0) ? 0 : 1));
              this.processPagination();
            }
            else
            {
              this.recordsInPage = this._records;
            }
        }
    }
    // paginate the records
    processPagination(lastSetOfRecords = null, lastNumberOfRecords = null) {
        if (lastSetOfRecords) {
            this.recordsInPage = this._records.slice(lastNumberOfRecords);
        } else {
            this.recordsInPage = this._records.slice(this._startFromIndex, this.pageSize + this._startFromIndex);
        }
    }
  
  
    // invoked on error
    getReject(error) {
          this.handleSpinner(false);
          this.records = undefined;
    }
    // invoked for all the async operations
    handleSpinner(showSpinner) {
        this.showSpinner = showSpinner;
    }
  
    handleSortdata(event) {
        this.sortBy = event.detail.fieldName;
        //this.sortedDirection = event.detail.sortDirection;
        let fieldValue = row => row[this.sortBy] || '';
        let reverse = this.sortedDirection === 'asc' ? 1 : -1;
        this.sortedDirection = this.sortedDirection === 'asc'?'desc':'asc';
        if(this._records!=undefined && this._records.length>0)
        {
            
            try{
                var records = Object.assign([], this._records);
                records = records.sort(
                    (a, b) => (a = fieldValue(a), b = fieldValue(b), reverse * ((a > b) - (b > a)))
                );
                this._records =[...records];
            }
            catch(error){console.error(error);}
            
            this.paginationRefresh();
            this.processPagination();
        }
    }
    
    @api getSelected() {
          var el = this.template.querySelector('lightning-datatable');
          return el.getSelectedRows();
      }
  
      //Pagination Information in datatable footer
      get recordsInfo() {
          if (this._records.length > 0) {
              this._endIndex = this._startFromIndex + this.pageSize;
              return 'Showing ' + (this._startFromIndex + 1) + " to " + ((this._endIndex > this._records.length) ? this._records.length : this._endIndex) + " of " + this._records.length + " records";
          }
          return 'Showing 0 of 0';
      }
  
      //Handle Single Row Selection
      handleRowSelection = event => {
          this.tempSelectedRows=this.selectedRows;
          var selectedRows=event.detail.selectedRows;
          this.recordSelected=false;
          if(this.selectedRows || selectedRows.length>0)
          {  
              this.recordSelected=true;
          }
         
          if(this.singleRowSelection && selectedRows.length>1)
          {
                 var el = this.template.querySelector('lightning-datatable');
                  el.selectedRows=el.selectedRows.slice(1);
                  event.preventDefault();
                  return;
          }
      }
      
      //Handle Edit and Delete Action in datatable 
      handleRowAction=event=>
      {
          const action = event.detail.action;
          const row = event.detail.row;
          if(row && this.objectName)
          { 
              this.recordId=row.Id;
              if(action.name==='edit')
              {
                  if(this.template.querySelector('c-common-dialog'))
                  {
                      this.template.querySelector('c-common-dialog').openmodal();
                  }
              }
              if(action.name==='delete')
              {                    
                  this.deleteRecordById();
              }
          }
      }
  
      //Deleting selected record id
      deleteRecordById=()=>
      {
          var index = findRowIndexById(this._records, this.recordId);
          if (index !== -1) {
              deleteRecord(this.recordId)
              .then(() => {
                      showMessage(this,'Notification','Record deleted','success');
                      this._records = this._records
                      .slice(0, index)
                      .concat(this._records.slice(index + 1));
                      this.refresh(this._records);
              })
              .catch(error => {
                  showMessage(this,'Notification','Error deleting record','error');
                  console.error(error);
              });
          }      
      }
  
      refresh(record){
          this.paginationRefresh();
          this.getResolve(record);     
      }
      handleSearch = event => {
          this.searchFieldVal = event.detail.value;
      }
  
      //Handle Search 
      handleSearchChange = event => {
          var inp=this.template.querySelector("lightning-input");
          if(!this.searchFieldVal)
          {
              if(inp.value!==undefined)
              {
                  inp.value='';
              }
              showMessage(this,'Notification','Select field to search','error');  
              return;
          }
         
          if(this.tempRecords.length==0)
          {
              this.tempRecords=this._records;
          }
          var result=arrayContainsValue(this.tempRecords,this.searchFieldVal,inp.value);
          console.log('result:' + result);
          if(inp.value==='' || inp.value==undefined)
          {
              result=this.tempRecords;
          }
         this.refresh(result);
      }
      handleSave= event => {
          var el = this.template.querySelector('lightning-datatable');
          var selected = el.getSelectedRows();
          this.dispatchEvent(new CustomEvent('rowselection', {
              detail: selected
          }));
          this.recordSelected=false;
          el.selectedRows=[];
      }
      @api refreshTable(result,selRows)
      {
        this.refresh(result);
        this.recordSelected=false;
        this.selectedRows=[selRows];
      }

      handleCancel(event)
      {
        this.refreshTable(this._records);
        this.selectedRows=[this.tempSelectedRows];
        this.dispatchEvent(new CustomEvent('cancel'));
      }

      @api updateColumns(columns)
      {
        this.columns=[...columns];
      }
  }