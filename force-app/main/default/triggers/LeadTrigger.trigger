trigger LeadTrigger on Lead (after update) {
    
    LeadTriggerHandler.HelperMethod(Trigger.newMap, Trigger.oldMap);

}