({ handleClick : function(component, event, helper) {
    
    component.set("v.boooo", !component.get("v.boooo"));
    var div = component.find('msg');
    //Show the success message after 3 seconds...
    window.setTimeout($A.getCallback(function() {
        if(component.isValid()) {
            $A.util.addClass(div, "slds-transition-show");
            component.set("v.boooo", !component.get("v.boooo"));
        }
    }), 3000);
    
    //hide the success message after 3 seconds...
    window.setTimeout($A.getCallback(function() {
        if(component.isValid()) {
            $A.util.removeClass(div, "slds-transition-show");
            $A.util.addClass(div, "slds-transition-hide");
        }
    }), 6000);
}
  
 })