public with sharing class JobSearchController {
    @AuraEnabled(cacheable=true)
    public static List<Job__c> searchJobs(String location, List<String> industries, String jobType) {
        // Query Salesforce custom object 'JobListing__c' based on the provided filters
        // You need to replace 'JobListing__c' with your actual custom object name
        String query = 'SELECT Id, Name, Location__c,Job_Type__c,Industry__c,Job_Description__c FROM Job__c WHERE ';
        
        if(String.isNotBlank(location)) {
            query += 'Location__c = \'' + String.escapeSingleQuotes(location) + '\' AND ';
        }

        if (industries != null && !industries.isEmpty()) {
            query += 'Industry__c IN (';
            for (String industry : industries) {
                query += '\'' + String.escapeSingleQuotes(industry) + '\',';
            }
            query = query.removeEnd(',') + ') AND ';
        }

        if(String.isNotBlank(jobType)) {
            query += 'Job_Type__c = \'' + String.escapeSingleQuotes(jobType) + '\' AND ';
        }

        
        query = query.substring(0, query.length() - 5);

        return Database.query(query);
    }


    @AuraEnabled(cacheable=true)
    public static Job__c getJobDetails(String jobId) {
        // Query Salesforce custom object 'Job__c' based on the provided Id
        return [SELECT Id, Name, Job_Description__c, Location__c, Industry__c, Job_Type__c
                FROM Job__c
                WHERE Id = :jobId
                LIMIT 1];
    }


}
