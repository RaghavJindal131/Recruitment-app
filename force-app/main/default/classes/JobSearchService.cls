@RestResource(urlMapping='/jobSearchService/*')
global with sharing class JobSearchService {

    @HttpGet
    global static String searchJobs() {
        RestContext.response.addHeader('Access-Control-Allow-Origin', 'https://d5j000006o76feas-dev-ed.my.salesforce.com, https://d5j000006o76feas-dev-ed.lightning.force.com,*');

        //RestContext.response.addHeader('Access-Control-Allow-Origin', 'https://d5j000006o76feas-dev-ed.lightning.force.com');
        //RestContext.response.addHeader('Access-Control-Allow-Origin', 'https://d5j000006o76feas-dev-ed.my.salesforce.com');
        RestContext.response.addHeader('Access-Control-Allow-Methods', 'GET');
        RestContext.response.addHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        //String location = RestContext.request.params.get('location');
        //String industry = RestContext.request.params.get('industry');
        //String jobType = RestContext.request.params.get('jobType');

        List<Job__c> jobList = [SELECT Id, Name, Location__c
                                FROM Job__c];
                                //WHERE Location__c = :location];

        return JSON.serialize(jobList);
    }
}