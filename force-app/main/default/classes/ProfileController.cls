public with sharing class ProfileController {
    @AuraEnabled(cacheable=true)
    public static Candidate_Profile__c getContactById(Id contactId) {
        system.debug('record id'+contactId);
        //Candidate_Profile__c cp = [SELECT Id, First_Name__c,Last_Name__c FROM Candidate_Profile__c WHERE Id = :contactId LIMIT 1];
        return [SELECT Id, First_Name__c,Last_Name__c,Address__c, class_10_percentage__c, class_12_percentage__c, Company_Name__c, Email__c, Mobile__c, Skills__c, Total_Experience__c  FROM Candidate_Profile__c WHERE Id = :contactId LIMIT 1];
    }

    @AuraEnabled(cacheable=true)
    public static Percentage__c getpercentrecord(Id candidateid) {
        system.debug('record id'+candidateid);
        //Candidate_Profile__c cp = [SELECT Id, First_Name__c,Last_Name__c FROM Candidate_Profile__c WHERE Id = :contactId LIMIT 1];
        return [SELECT Id,Name,percent_value__c  FROM Percentage__c WHERE Id = :candidateid LIMIT 1];
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
    //week 4
    @AuraEnabled(cacheable=true)
    public static Map<ID, String> getRelatedFilesByRecordId(String recordId) {
             
        List<ContentDocumentLink> files = [SELECT id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId];
        List<ID> fileIDs = new List<ID>();
        for (ContentDocumentLink docLink : files) {
            fileIDs.add(docLink.ContentDocumentId);
        }
 
        List<ContentVersion> docs = [SELECT ContentDocumentId, FileExtension, Title 
            FROM ContentVersion WHERE ContentDocumentId IN : fileIDs];
          
        Map<ID, String> mapIdTitle = new Map<ID, String>();
        for (ContentVersion docLink : docs) {
            mapIdTitle.put(docLink.ContentDocumentId, docLink.Title);
        }
        return mapIdTitle;
    }


    //saving the PDF to attached record
    @AuraEnabled
    public static void savePDFAttachmentController(String pdfContent, Id parentId) {
        //Blob decodedBlob = EncodingUtil.base64Decode(pdfContent);
        Blob formatJson = EncodingUtil.base64Decode(JSON.serializePretty(pdfContent));
        // Create a ContentVersion
        ContentVersion cv = new ContentVersion(
            VersionData = formatJson,
            Title = 'Generated Resume',
            FirstPublishLocationId = parentId
        );

        // Insert the ContentVersion record
        insert cv;

        // Create a ContentDocumentLink
        ContentDocumentLink cdl = new ContentDocumentLink(
            ContentDocumentId = [SELECT Id FROM ContentVersion WHERE Id = :cv.Id LIMIT 1].ContentDocumentId,
            LinkedEntityId = parentId,
            ShareType = 'I'
        );

        // Insert the ContentDocumentLink record
        insert cdl;
    }
}