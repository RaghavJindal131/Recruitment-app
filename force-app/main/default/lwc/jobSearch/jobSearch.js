import { LightningElement,track,wire  } from 'lwc';
//import searchJobs from '@salesforce/apex/JobSearchService.searchJobs';
import searchJobs from '@salesforce/apex/JobSearchController.searchJobs';
import { NavigationMixin } from 'lightning/navigation';



export default class JobSearch extends NavigationMixin(LightningElement) {

    @track locationFilter = '';
    @track industryFilter = [];
    @track jobTypeFilter = '';
    @track jobList = [];
    jobs;
    
    industryOptions = [
        { label: 'Information Technology', value: 'Information Technology' },
        { label: 'Cybersecurity', value: 'Cybersecurity' },
        { label: 'Software Development', value: 'Software Development' },
    ];
    
    jobTypeOptions = [
        { label: 'Full-time', value: 'Full-time' },
        { label: 'Part-time', value: 'Part-time' },
        { label: 'Internship', value: 'Internship' },
        { label: 'Remote', value: 'Remote' },
    ];


    @wire(searchJobs)
    wiredJobListings({ error, data }) {
        if (data) {
            this.jobList = data;
            console.log('the data returned is inside the wire ' + this.jobList);
        } else if (error) {
            console.error('Error fetching job listings1:', error);
        }
    }

    handleLocationChange(event) {
        this.locationFilter = event.target.value;
    }
    handleIndustryChange(event) {
        this.industryFilter = event.detail.value;
    }

    handleJobTypeChange(event) {
        this.jobTypeFilter = event.target.value;
    }

    searchJobs() {
       //this.fetchJobs();
       searchJobs({ location: this.locationFilter, industries: this.industryFilter, jobType: this.jobTypeFilter })
            .then(result => {
                this.jobList = result;
                console.log('the data returned is ' + this.jobList); 

                this.jobList.forEach(job => {
                    console.log('Job Name:', job.Name);
                    console.log('Job Location:', job.Location__c); // Replace with the actual field name
                    // Add more attributes as needed
                });
            })
            .catch(error => {
                console.error('Error fetching job listings2:', error);
            });

    }   

    handleViewMore(event) {
        const jobId = event.currentTarget.dataset.id;
        // Use NavigationMixin to navigate to the new page
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: jobId,
                actionName: 'view'
            }
        });
    }


    
    // async fetchJobs() {
    //     try {
    //         console.log('inside the try block');
    //         const response = await fetch(`https://d5j000006o76feas-dev-ed.my.salesforce.com/services/apexrest/jobSearchService`, {
    //             method: 'GET',
    //             cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //             credentials: 'same-origin',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 // Add other headers if needed
    //             },
    //             mode: 'cors',
    //             // Additional fetch options (e.g., mode, credentials) can go here
    //         });
    //         console.log('response line done');
    //         if (response.ok) {
    //             const data = await response.json();
    //             this.jobs = data;
    //         } else {
    //             // const data = await response.json();
    //             // this.jobs = data;
    //             // console.log('segsg'+jobs);
    //             console.error('Failed to fetch jobs:', response.statusText);
    //         }
    
    //         // Rest of your code...
    //     } catch (error) {
    //         console.error('Error fetching jobs:', error);
    //     }
    // }    
       
    

}