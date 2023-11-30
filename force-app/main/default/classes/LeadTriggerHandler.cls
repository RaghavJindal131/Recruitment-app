public with sharing class LeadTriggerHandler {
    public static void HelperMethod(Map<Id, Lead> newLeadMap, Map<Id, Lead> oldLeadMap) {
        
        set<id> idset=new set<id>();
        
        for (Id each : newLeadMap.keySet()) {
                Lead newLead = (Lead) newLeadMap.get(each);
                Lead oldLead = oldLeadMap != null ? (Lead) oldLeadMap.get(each) : new Lead();
                if(newLead.Approval_Status__c == 'Approved' && (newLead.Approval_Status__c != oldLead.Approval_Status__c)) {
                    idset.add(each);
                }
            }

        
        if(!(idset == NULL)){
        try{
            //Inserting Contact Record
            list<Contact> contactObj = new list<Contact>(); 
            for (Lead lead : [SELECT Id,Name, Email FROM Lead WHERE ID IN :idset]){
                Contact ConObj = new Contact();
                ConObj.Lead__c  = lead.id;
                ConObj.LastName = lead.Name;
                contactObj.add(ConObj);
                //system.debug('**'+lead.ConvertedAccountId);
               }
            if(contactObj.size() > 0){
                    insert contactObj;
               }
            
            
            //Inserting Account Record
            list<Account> accountObj = new list<Account>(); 
            for (Lead lead : [SELECT Id,Company,Name, Email FROM Lead WHERE ID IN :idset]){
                Account accObj = new Account();
                accObj.Lead__c  = lead.id;
                accObj.Name = lead.Company;
                accountObj.add(accObj);
               }
            
            if(accountObj.size() > 0){
                	set<id> accidset=new set<id>();
                	Database.SaveResult[] result = Database.insert(accountObj, false);
                	
					for(Database.SaveResult sr : result){
                        system.debug('id of acc' + sr.getId());
						accidset.add(sr.getId());
					}
                //enable partner account and create partner user
                if(accidset.size() > 0){
                Account acc = [SELECT Id FROM Account WHERE Id IN : accidset];
                system.debug('account record' + acc);
				acc.IsPartner = true;
				update acc;
            	}
               	// Create a Portal User
               	list<User> portalUser = new list<User>();
                Profile portalProfile = [select Id from Profile where Name = 'Partner Community User' limit 1];
				User pUser = new User();
				pUser.Username = 'rjinda12313143l@salesforce.com'; //unique
				pUser.Email = 'rjindal@salesforce.com';
				pUser.FirstName = 'Raghav';
				pUser.LastName = 'Jindal';
                pUser.ProfileId = portalProfile.Id;
                pUser.ContactId  = '0035j00000IQwOPAA1';   //unique
                pUser.Alias = 'test123';
                pUser.CommunityNickname = 'test112344';    //unique
                pUser.TimeZoneSidKey = 'America/Los_Angeles';
    			pUser.LocaleSidKey = 'en_US';
    			pUser.LanguageLocaleKey = 'en_US';
                pUser.EmailEncodingKey = 'UTF-8';
                portalUser.add(pUser);
				
				insert portalUser;

             }
            
       
            //Inserting Opportunity Record
            list<Opportunity> opportunityObj = new list<Opportunity>(); 
            for (Lead lead : [SELECT Id,Company,Name, Email FROM Lead WHERE ID IN :idset]){
                Opportunity oppObj = new Opportunity();
                oppObj.Lead__c  = lead.id;
                oppObj.Name = lead.Company;
                oppObj.StageName = 'Prospecting';
                oppObj.CloseDate = Date.Today();
                opportunityObj.add(oppObj);
               }
            if(opportunityObj.size() > 0){
                    insert opportunityObj;
               }
            
            
            
        
          }
            
        catch(Exception e){
                system.debug('The following error is encountered' + e.getMessage());
            }  
        }
        
        
    }

}