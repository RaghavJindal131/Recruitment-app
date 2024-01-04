public class UserTriggerHandler {

    public static void handleAfterInsert(List<User> newUserList) {
         Map<Id, Profile> profileMap = new Map<Id, Profile>([SELECT Id, Name FROM Profile WHERE Id IN :getUserProfileIds(newUserList)]);
        system.debug('profile amp ' + profileMap);
        List<Candidate_Profile__c> candidateProfilesToInsert = new List<Candidate_Profile__c>();
		system.debug('entered after insert');
        system.debug('new user List' + newUserList);
        for (User newUser : newUserList) {
            // Check if the user's profile is "Candidate Partner User"
            if (profileMap.containsKey(newUser.ProfileId)){
                system.debug('profile is added to the new user');
                if(profileMap.get(newUser.ProfileId).Name == 'Candidate Partner User'){
                    
                  // Create a Candidate_Profile__c record with the First_Name
                system.debug('profile match found');
                Candidate_Profile__c candidateProfile = new Candidate_Profile__c(
                    Name = newUser.FirstName,
                    First_Name__c = newUser.FirstName,
                    User__c = newUser.Id,
                    OwnerId = newUser.Id
                    // Add other fields as needed
                );
                candidateProfilesToInsert.add(candidateProfile);
                }
            }
            
            else{
                system.debug('profile match not found');
            }
        }

        // Insert the Candidate_Profile__c records
        if (!candidateProfilesToInsert.isEmpty()) {
            system.debug('inserting the candidate profile record');
            insert candidateProfilesToInsert;
        }
        else{
            system.debug('candidate profile record not inserted');
        }
    }
    
    private static Set<Id> getUserProfileIds(List<User> users) {
        Set<Id> profileIds = new Set<Id>();
        for (User user : users) {
            profileIds.add(user.ProfileId);
            system.debug('entered in finding the profile id');
        }
        system.debug('profile id is' + profileIds);
        return profileIds;
    }
}