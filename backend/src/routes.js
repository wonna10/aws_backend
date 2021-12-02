// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const companyController = require('./controllers/companyController');
const roleController = require('./controllers/roleController')
const stripeController = require('./controllers/stripeController')

const access = require("./middlewares/access");
const validators = require("./middlewares/validators");
const { checkSchema } = require('express-validator');

// Match URL's with controllers
exports.appRoute = router => {

    // Webhook
    router.post("/api/v1/webhooks/stripe", access.verifyStripeWebhookRequest, stripeController.handleWebhook);

    // Users Endpoint

    //Forget Password
    router.post("/api/auth/resetPasswordEmail", checkSchema(validators.forgotpasswordSchema), authController.sendResetPasswordEmail);

    router.put("/api/auth/resetPassword", authController.resetPassword);

    // Refresh JWT token
    router.post('/api/u/user/refreshtoken/', authController.processRefreshToken)

    /// Clear Cookies
    router.post('/api/u/user/clearcookies/', authController.processClearCookies)

    // Check whether if user belongs to the company
    router.get('/api/u/user/checkuser/', userController.processCheckUser)

    // Called by eiso super admin, admin and user to logon to the system
    router.post('/api/u/user/signin', checkSchema(validators.loginSchema), authController.processUserLogin);

    // Called by the admin logon to the system
    router.post('/api/a/users/adminsignin', checkSchema(validators.loginSchema), authController.processAdminLogin);

    // Get User rights by user id
    router.get('/api/u/users/getuserrights/:userId', userController.processGetRights);

    // Send Super Admin Invite
    router.post('/api/a/user/sendsuperadmininvite', userController.processSendSuperAdminInvite)

    // Send User Invite
    router.post('/api/u/user/senduserinvite', userController.processSendUserInvite)

    // Check Email and Key
    router.post('/api/u/user/checkemailandkey', userController.processCheckEmailAndKey)

    // Get User Invite List by company id
    router.get('/api/u/user/getuserinvitelist/:companyId', userController.processGetUserInviteList)

    // Get Super Admin Invite List by company id
    router.get('/api/a/user/getsuperadmininvitelist/', userController.processGetSuperAdminInviteList)

    // Delete invite
    router.delete('/api/u/user/deleteinvite/:email', userController.processDeleteInvite)

    // Resend Invite
    router.post('/api/u/user/resendinvite', userController.processResendInvite)

    // Creates Super Admin and User
    router.post('/api/u/user/createuser', checkSchema(validators.registrationSchema), userController.processCreateUser)

    // Get one user detail by user id
    router.get('/api/u/user/getuserdata/:userId', userController.processGetOneUserData);

    // Update user detail by user id 
    router.put('/api/u/user/updateuser/:userId', userController.processUpdateUser)

    // Update user status by user id 
    router.put('/api/u/user/updateuserstatus/:userId', userController.processUpdateUserStatus)

    // Reset Password by gu id
    router.put('/api/u/user/resetpassword/:user_uuid', userController.processResetPassword)

    // Change Password by user id
    router.put('/api/u/user/changepassword/:user_uuid', userController.processChangePassword)

    // Get all user data by company id
    router.get('/api/u/user/getalluserdata/:companyId', userController.processGetAllUserData)

    // Get Handler List
    router.get('/api/u/user/gethandlerlist/', userController.processGetHandlerList)

    // Get companies stats
    router.get('/api/a/user/getusersstats', userController.processGetUsersStats)


    // Company Endpoints

    // Called by admin to create new company
    router.post('/api/a/company/createcompany/:userId', companyController.processCreateCompany)

    // Get all companies
    router.get('/api/a/company/getallcompanies', companyController.processGetAllCompanies)

    // Get companies stats
    router.get('/api/a/company/getcompaniesstats', companyController.processGetCompaniesStats)

    // router.get('/api/a/company/getcompaniesstats', companyController.processGetCompaiesStats)

    // Get Company Data by company id
    router.get('/api/u/company/getcompanydata/:companyId', companyController.processGetCompanyData)

    // Update Company Data by company id
    router.put('/api/u/company/updatecompany/:companyId', companyController.processUpdateCompany)

    // Update Company status by company id
    router.put('/api/a/company/updatecompanystatus/:companyId', companyController.processUpdateCompanyStatus)


    //Role Endpoint

    // Check whether if role belongs to the company
    router.get('/api/u/role/checkrole/', roleController.processCheckRole)

    // Create role by company id
    router.post('/api/u/role/createrole/:companyId', roleController.processCreateRole)

    // update role by role id
    router.put('/api/u/role/updaterole/:roleId', roleController.processUpdateRole)

    // update role rights by role id
    router.put('/api/u/role/updaterolerights/:roleId', roleController.processUpdateRoleRights)

    // update role by role id
    router.delete('/api/u/role/deleterole/:roleId', roleController.processDeleteRole)

    // Get all roles by company id
    router.get('/api/u/role/getallroles/:companyId', roleController.processGetAllRoles)

    // Get one role by role id
    router.get('/api/u/role/getonerole/:roleId', roleController.processGetOneRole)

    // Get user role by user id
    router.get('/api/u/role/getuserrole/:userId', roleController.processGetUserRole)

    // Update user roles by user id
    router.put('/api/u/role/updateuserrole/:userId', roleController.processUpdateUserRole)


    // Stripe

    //Create Payment Intent
    router.post('/api/u/stripe/setupintents/', stripeController.createSetupIntent)

    //Create Payment Method
    router.post('/api/u/stripe/paymentmethods/', stripeController.createPaymentMethod)

    //Get All Companies
    router.get('/api/u/stripe/paymentmethods/', stripeController.getAllPaymentMethods)

    //Get All Plans
    router.get('/api/u/stripe/plans/', stripeController.getAllPlans)

    //Get All Subscriptions
    router.get('/api/u/stripe/subscriptions/', stripeController.getAllSubscriptions)

    //Get Subscriptions By Acc_Id
    router.get('/api/u/stripe/subscription/', stripeController.getSubscriptionById)

    //Create Subscriptions
    router.post('/api/u/stripe/subscriptions/:type', stripeController.createSubscription)

    //Remove Subscriptions
    router.delete('/api/u/stripe/subscriptions/', stripeController.cancelSubscription)

    //Remove Payment Method
    router.delete('/api/u/stripe/paymentmethods/:paymentMethodID', stripeController.removePaymentMethod)
};