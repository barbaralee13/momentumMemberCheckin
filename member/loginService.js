var registrationsRepository = require("./registrationsRepository")
var verificationService = require('./verificationService')

exports.login = async function(accountNumber, imageId, db) {
    let found = await verificationService.verifyAccount(accountNumber, db);
    if (!found) {
        // The account provided was not valid.
        return false;
    }

    let registration = await registrationsRepository.findRegistration(accountNumber, db);
    if (registration != null) {
        // The registration already exists, ensure it matches the image id that was used.
        return registration.imageId == imageId;
    }

    // The user has not already been registered, assume they are registering and persistent during login.
    registration = { "accountNumber": accountNumber, "imageId": imageId };
    await registrationsRepository.insertRegistration(registration, db);

    return true;
}