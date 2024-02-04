import { LightningElement, api,wire } from 'lwc';
import getJobDetails from '@salesforce/apex/JobSearchController.getJobDetails';


export default class JobDetailsPage extends LightningElement {
    @api recordId;
    jobName;
    jobDescription;
    jobLocation;
    jobIndustry;
    jobType;

    @wire(getJobDetails, { jobId: '$recordId' })
    wiredJobDetails({ error, data }) {
        if (data) {
            this.jobName = data.Name;
            this.jobDescription = data.Job_Description__c;
            this.jobLocation = data.Location__c;
            this.jobIndustry = data.Industry__c;
            this.jobType = data.Job_Type__c;
            // Add more properties for additional details
        } else if (error) {
            console.error('Error fetching job details:', error);
        }
    }
}