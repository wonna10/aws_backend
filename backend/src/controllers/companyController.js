const companyService = require('../services/companyService');
const config = require('../config/config');
const address = require('../services/addressService')
const moment = require('moment')

const { BadRequestError } = require('../errorClasses/Errors');

exports.processCreateCompany = async (req, res, next) => {
    console.log('processCreateCompany running');
    // Collect data from the request body 
    let data = req.body.data
    let company_name = data.name;
    let company_description = data.description
    let company_email = data.email
    let company_contact_number = data.contact
    let country = data.country.label
    let state = data.state
    let street = data.street
    let postal_code = data.postalcode
    let user_id = req.params.userId


    var currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
    try {
        let company_address_id = await address.createAddress(country, state, street, postal_code)
        let company_id = await companyService.createCompany(company_name, company_description, company_address_id, company_email, company_contact_number)

        return res.status(200).json({ message: 'Company has been created.' });
    } catch (error) {
        // console.log(error);
        // return res.status(500).json({ message: error.userMessage });
        next(error);
    }


}; //End of processCreateCompany

exports.processGetAllCompanies = async (req, res, next) => {
    try {
        let results = await companyService.getAllCompanies()
        return res.status(200).send(results);
    } catch (error) {
        // return res.status(500).json({ message: error.userMessage });
        next(error);
    }


}; //End of processGetAllCompanies

exports.processGetCompanyData = async (req, res, next) => {
    let company_id = req.params.companyId
    try {
        let results = await companyService.getCompanyData(company_id)
        return res.status(200).send(results);
    } catch (error) {
        // return res.status(500).json({ message: error.userMessage });
        next(error);
    }


}; //End of processGetCompanyData


exports.processUpdateCompanyStatus = async (req, res, next) => {
    let company_id = req.params.companyId
    let status = req.body.data.status
    let reason = req.body.data.reason
    try {
        let results = await companyService.updateCompanyStatus(company_id, status, reason)
        return res.status(200).send(results);
    } catch (error) {
        // console.log(error)
        // return res.status(500).json({ message: error.userMessage });
        next(error);
    }


}; //End of processUpdateCompanyStatus


exports.processUpdateCompany = async (req, res, next) => {
    let company_id = req.params.companyId
    let data = req.body.data
    let name = data.name
    let description = data.description
    let email = data.email
    let contact_number = data.contact_number
    let country = data.country.label
    let state = data.state
    let street = data.street
    let postal_code = data.postalcode
    try {
        let address_id = await address.getAddressIdCompany(company_id);
        await companyService.updateCompany(company_id, name, description, email, contact_number);

        await address.updateAddress(country, state, street, postal_code, address_id);
        return res.status(200).send('Sucessfully updated');

    } catch (error) {
        console.log(error)
        if (error.errno == 1062) {
            // return res.status(401).send({
            //     code: 401,
            //     error: true,
            //     description: 'Email has already been registered.',
            //     content: []
            // });
            next(BadRequestError("Email has already been registered."));
        }
        else {
            // let message = 'Server is unable to process your request.';
            // return res.status(500).send({
            //     message: error
            // });
            next(error);
        }
    }

}; //End of processUpdateCompany

exports.processGetCompaniesStats = async (req, res, next) => {
    try {
        let results = await companyService.getCompanyStats()
        return res.status(200).send(results);
    } catch (error) {
        // console.log(error)
        // return res.status(500).json({ message: error.userMessage });
        next(error);
    }


}; //End of processGetCompaiesStats


