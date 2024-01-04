import { LightningElement,track,api,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';
import {NavigationMixin} from 'lightning/navigation'
import getContactById from '@salesforce/apex/ProfileController.getContactById';
import updateContact from '@salesforce/apex/ProfileController.updateContact';
import getLoggedInUserId from '@salesforce/apex/ProfileController.getLoggedInUserId';
import getCandidateProfileId from '@salesforce/apex/ProfileController.getCandidateProfileId';
import savePDFAttachmentController from '@salesforce/apex/ProfileController.savePDFAttachmentController';
import getRelatedFilesByRecordId from '@salesforce/apex/ProfileController.getRelatedFilesByRecordId';
import { loadScript } from 'lightning/platformResourceLoader';
import JS_PDF from '@salesforce/resourceUrl/jsPDF';

export default class CandidateProfile extends NavigationMixin(LightningElement)  {

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


    //week 4
    get acceptedFormats() {
        return ['.pdf', '.png'];
    }

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        alert('No. of files uploaded : ' + uploadedFiles.length);
    }

    //getRelatedFiles preview
    filesList =[]
    @wire(getRelatedFilesByRecordId, {recordId: '$candidateProfileId'})
    wiredResult({data, error}){ 
        if(data){ 
            console.log(data)
            this.filesList = Object.keys(data).map(item=>({"label":data[item],
             "value": item,
             "url":`/sfc/servlet.shepherd/document/download/${item}`
            }))
            console.log(this.filesList)
        }
        if(error){ 
            console.log(error)
        }
    }
    previewHandler(event){
        console.log(event.target.dataset.id)
        console.log('preview handler called');
        this[NavigationMixin.Navigate]({ 
            type:'standard__namedPage',
            attributes: {
                url: 'https://d5j000006o76feas-dev-ed.my.salesforce.com/sfc/p/5j000006O76F/a/5j000000jBcX/5f0JdWw3ynbxfJKNTBzuZ5UGqnBlP.jgGFtz6yg8fEo'

            }
            
        })
    }
    renderedCallback() {
		if (!this.jsPDFInitialized) {
			this.jsPDFInitialized = true;
			loadScript(this, JS_PDF)
				.then(() => {
					console.log('jsPDF library loaded successfully');
				})
				.catch((error) => {
					console.error('Error loading jsPDF library', error);
				});
		}
	}



    handlePDFGenerateClick(){
        console.log('generate PDF method called');
        if (this.jsPDFInitialized) {
			// Make sure to correctly reference the loaded jsPDF library.
            const vfPageUrl = '/apex/ResumeGenerate';
            const pdfContentPromise = this.fetchVisualforcePageContent(vfPageUrl);

            pdfContentPromise.then((pdfContent) => {
                console.log('pdf Content - ' + pdfContent);
                // Save the generated PDF as an attachment to the Candidate Profile record
                this.savePDFAttachment(pdfContent);
            }).catch(error => {
                console.error('Error generating PDF content:', error);
            });


			// const doc = new window.jspdf.jsPDF();
			// // Add content to the PDF.
			// doc.text('Hello PDF!', 10, 10);
			// // Save the PDF.
			// doc.save('generated_pdf.pdf');
		} else {
			console.error('jsPDF library not initialized');
		}
    }

    fetchVisualforcePageContent(url) {
        console.log('fetching VF page content');
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        reject(`Error fetching Visualforce page content. HTTP status ${response.status}`);
                    }
                    return response.text();
                })
                .then(content => {
                    resolve(content);
                })
                .catch(error => {
                    reject(`Error fetching Visualforce page content: ${error.message}`);
                });
        });
    }

    savePDFAttachment(pdfContent) {
        // Use lightning-record-edit-form to save the generated PDF as an attachment
        console.log('saving the PDF as attachment');
        const parentId = 'a0F5j00000dlXWLEA2'; // Replace with the actual Candidate Profile record Id
     

        savePDFAttachmentController({ pdfContent, parentId })
        .then(() => {
            // Success - Display a toast
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'PDF attached successfully!',
                    variant: 'success'
                })
            );
        })
        .catch(error => {
            // Error - Display an error toast
            console.error('Error attaching PDF:', error.body.message);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Error attaching PDF: ' + error.body.message,
                    variant: 'error'
                })
            );
        });


        




    }

       



}