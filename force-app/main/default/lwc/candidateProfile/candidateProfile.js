import { LightningElement,track,api,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';
import getContactById from '@salesforce/apex/ProfileController.getContactById';
import updateContact from '@salesforce/apex/ProfileController.updateContact';
import getLoggedInUserId from '@salesforce/apex/ProfileController.getLoggedInUserId';
import getCandidateProfileId from '@salesforce/apex/ProfileController.getCandidateProfileId';

export default class CandidateProfile extends LightningElement {

    @api recordId;
    @track contactRecord;
    @track firstName;
    @track lastName;
    @track email;
    @track mobile;
    @track address;
    @track class10;
    @track class12;
    @track companyname;
    @track totalexp;
    @track skills;
    @track isEditMode = false;
    @track showModal = false;
    @track loggedInUserId;
    @track candidateProfileId;

    @wire(getLoggedInUserId)
    wiredUserId({ error, data }) {
        if (data) {
            // Store the logged-in user's ID
            this.loggedInUserId = data;
            console.log('logged in user id-'+this.loggedInUserId);

        } else if (error) {
            console.error('Error retrieving logged in user id:', error);
        }
    }

    @wire(getCandidateProfileId, { userId: '$loggedInUserId', })
    wiredCanId({ error, data }) {
        if (data) {
            // Store the logged-in user's ID
            this.candidateProfileId = data;
            console.log('candidate profile id-'+this.candidateProfileId);
        } else if (error) {
            console.error('Error retrieving logged in candidate id:', error);
        }
    }
    
    @wire(getContactById, { contactId: '$candidateProfileId', })
    wiredContact({ error, data }) {
        console.log('data---' + JSON.stringify(data));
        //console.log('record id' + recordId);
        if (data) {
            console.log('data is' +this.firstName);
            this.contactRecord = data;
            this.firstName = data.First_Name__c;
            this.lastName = data.Last_Name__c;
            this.email = data.Email__c;
            this.mobile = data.Mobile__c;
            this.address = data.Address__c
            this.class10 = data.class_10_percentage__c
            this.class12 = data.class_12_percentage__c
            this.companyname = data.Company_Name__c
            this.totalexp = data.Total_Experience__c
            this.skills = data.Skills__c            
        } else if (error) {
            console.error('Error retrieving contact:', error);
        }
    }

    handleFirstNameChange(event) {
        this.firstName = event.target.value;
    }

    handleLastNameChange(event) {
        this.lastName = event.target.value;
    }
    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handleMobileChange(event) {
        this.mobile = event.target.value;
    }
    handleAddressChange(event) {
        this.address = event.target.value;
    }

    handleClass10PerChange(event) {
        this.class10 = event.target.value;
    }
    handleClass12PerChange(event) {
        this.class12 = event.target.value;
    }

    handleCompanyNameChange(event) {
        this.companyname = event.target.value;
    }
    handleTotalExperienceChange(event) {
        this.totalexp = event.target.value;
    }
    handleSkillsChange(event) {
        this.skills = event.target.value;
    }

    // handleSubmit() {
    //     console.log('edit mode is --' + isEditMode);
    //     if (this.isEditMode) {
    //         console.log('inside edit mode');
    //         this.contactRecord.FirstName = this.firstName;
    //         //this.contactRecord.LastName = this.lastName;
    //         updateContact({ updatedContact: this.contactRecord })
    //             .then(() => {
    //                 this.isEditMode = false;
    //                 this.dispatchEvent(
    //                     new ShowToastEvent({
    //                         title: 'Success',
    //                         message: 'Contact updated successfully',
    //                         variant: 'success',
    //                     })
    //                 );
    //             })
    //             .catch((error) => {
    //                 console.error('Error updating contact:', error);
    //             });
    //     } else {
    //         // Handle submission logic (e.g., create new contact record)
    //         console.log('not in edit mode');
    //     }
    // }

    handleEdit() {
        this.isEditMode = true;
        this.showModal = true;
        console.log('handle edit clicked');
    }

    handleSave() {
        const updatedCustomObject = {
            sObjectType: 'Candidate_Profile__c',
            Id: this.candidateProfileId,
            fields: {
                First_Name__c: this.firstName, 
                Last_Name__c: this.lastName, 
                Email__c : this.email,
                Mobile__c : this.mobile,
                Address__c : this.address,
                class_10_percentage__c : this.class10,
                class_12_percentage__c : this.class12,
                Company_Name__c : this.companyname,
                Total_Experience__c : this.totalexp,
                Skills__c : this.skills
                
            },
            
        };
        updateContact({ updatedCustomObject: JSON.stringify(updatedCustomObject)  })
        .then(() => {
            this.isEditMode = false;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact updated successfully',
                    variant: 'success',
                })
            );
        })
        .catch((error) => {
            console.error('Error updating contact:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'An error occurred while updating the custom object',
                    variant: 'error',
                })
            );
        });
        this.showModal = false;
        setTimeout(function () { (window.location.reload()) }.bind(this), 2000);
    }
    handleCancel() {
        // Reset any changes made
        this.showModal = false;
    }

}