public with sharing class ProfileController {
    @AuraEnabled(cacheable=true)
    public static Candidate_Profile__c getContactById(Id contactId) {
        system.debug('record id'+contactId);
        //Candidate_Profile__c cp = [SELECT Id, First_Name__c,Last_Name__c FROM Candidate_Profile__c WHERE Id = :contactId LIMIT 1];
        return [SELECT Id, First_Name__c,Last_Name__c,Address__c, class_10_percentage__c, class_12_percentage__c, Company_Name__c, Email__c, Mobile__c, Skills__c, Total_Experience__c  FROM Candidate_Profile__c WHERE Id = :contactId LIMIT 1];
    }

    @AuraEnabled
    public static void updateContact(String updatedCustomObject) {
        try {
            system.debug('string data' + updatedCustomObject);
            Candidate_Profile__c customObject = (Candidate_Profile__c) JSON.deserialize(updatedCustomObject, Candidate_Profile__c.class);
            // Fetch the existing record
            system.debug('entered in the update');
            system.debug('updated record data   -' + updatedCustomObject);
            Candidate_Profile__c existingRecord = [SELECT Id, First_Name__c,Last_Name__c,Address__c, class_10_percentage__c, class_12_percentage__c, Company_Name__c, Email__c, Mobile__c, Skills__c, Total_Experience__c  FROM Candidate_Profile__c WHERE Id = :customObject.Id LIMIT 1];
            system.debug('existing record data- ' + existingRecord);
            // Update the fields
            existingRecord.First_Name__c = customObject.First_Name__c;
            existingRecord.Last_Name__c = customObject.Last_Name__c;
            existingRecord.Address__c = customObject.Address__c;
            existingRecord.class_10_percentage__c = customObject.class_10_percentage__c;
            existingRecord.class_12_percentage__c = customObject.class_12_percentage__c;
            existingRecord.Company_Name__c = customObject.Company_Name__c;
            existingRecord.Email__c = customObject.Email__c;
            existingRecord.Mobile__c = customObject.Mobile__c;
            existingRecord.Skills__c = customObject.Skills__c;
            existingRecord.Total_Experience__c = customObject.Total_Experience__c;
            

            // Save the record
            update existingRecord;
        } catch (Exception e) {
            throw new AuraHandledException('Error updating custom object: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Id getLoggedInUserId() {
        return UserInfo.getUserId();
    }

    @AuraEnabled(cacheable=true)
    public static Id getCandidateProfileId(Id userId) {

        List<Candidate_Profile__c> candidateProfiles = [
            SELECT Id FROM Candidate_Profile__c WHERE User__c = :userId LIMIT 1
        ];
    
        if (!candidateProfiles.isEmpty()) {
            return candidateProfiles[0].Id;
        }
        return null;
}
}
