@isTest
private class LeadTriggerHandlerTest {

    @isTest
    static void testLeadTriggerHandler() {
        
        Lead testLead = new Lead(
            FirstName = 'Raghav',
            LastName = 'Jindal',
            Company = 'Salesforce',
            Approval_Status__c = 'Approved'
        );

        insert testLead;
        Map<Id, Lead> newLeadMap = new Map<Id, Lead>{ testLead.Id => testLead };
        Map<Id, Lead> oldLeadMap = new Map<Id, Lead>();

        testLead.Approval_Status__c = 'Rejected';
        update testLead;

        Test.startTest();
        LeadTriggerHandler.HelperMethod(newLeadMap, oldLeadMap);
        Test.stopTest();
        //no record should be added
        System.assertEquals(0, [SELECT COUNT() FROM Contact]);
        System.assertEquals(0, [SELECT COUNT() FROM Account]);
        System.assertEquals(0, [SELECT COUNT() FROM Opportunity]);

        testLead.Approval_Status__c = 'Approved';
        update testLead;
        Test.startTest();
        LeadTriggerHandler.HelperMethod(newLeadMap, oldLeadMap);
        Test.stopTest();
		//some record should get added
        System.assertNotEquals(0, [SELECT COUNT() FROM Contact]);
        System.assertNotEquals(0, [SELECT COUNT() FROM Account]);
        System.assertNotEquals(0, [SELECT COUNT() FROM Opportunity]);
    }
}