const role = require('../services/roleService')
const config = require('../config/config');


exports.processCheckRole = async (req, res, next) => {
    let company_id = req.query.companyId
    let role_id = req.query.roleId
    try {
        let results = await role.checkRole(role_id, company_id);

        return res.status(200).send(results);

    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processCheckRole

exports.processCreateRole = async (req, res, next) => {
    let company_id = req.params.companyId
    let name = req.body.name
    let description = req.body.description

    try {
        await role.createRole(company_id, name, description);

        return res.status(200).send('Sucessfully created');

    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processCreateRole

exports.processUpdateRole = async (req, res, next) => {
    let role_id = req.params.roleId
    let name = req.body.name
    let description = req.body.description
    try {
        await role.updateRole(role_id, name, description);

        return res.status(200).send('Sucessfully updated');

    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processUpdateRole

exports.processUpdateRoleRights = async (req, res, next) => {
    let data = req.body.data
    let role_id = req.params.roleId
    let swot = data.swot_rights.value
    let ror = data.ror_rights.value
    let ip = data.ip_rights.value
    let qms = data.qms_rights.value
    let policy = data.policy_rights.value
    let raa = data.raa_rights.value
    let oap = data.oap_rights.value
    let scope = data.scope_rights.value
    let nr = data.nr_rights.value
    let td = data.td_rights.value
    try {
        await role.updateRoleRights(role_id, swot, ror, ip, qms, policy, raa, oap, scope, nr, td);

        return res.status(200).send('Sucessfully updated');

    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processUpdateRoleRights

exports.processDeleteRole = async (req, res, next) => {
    let role_id = req.params.roleId
    try {
        await role.deleteRole(role_id);

        return res.status(200).send('Sucessfully deleted');

    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processDeleteRole

exports.processGetAllRoles = async (req, res, next) => {
    let company_id = req.params.companyId
    try {
        let results = await role.getAllRoles(company_id);
        if (results) {
            var jsonResult = {
                data: results
            }
            return res.status(200).send(jsonResult);
        }

    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processGetAllRoles

exports.processGetOneRole = async (req, res, next) => {
    let role_id = req.params.roleId
    try {
        let results = await role.getOneRole(role_id);
        if (results) {
            var jsonResult = {
                data: results
            }
            return res.status(200).send(jsonResult);
        }

    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processGetOneRole

exports.processGetUserRole = async (req, res, next) => {
    let user_id = req.params.userId
    try {
        let results = await role.getUserRole(user_id);
        if (results) {
            var jsonResult = {
                data: results
            }
            return res.status(200).send(jsonResult);
        }

    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processGetUserRole

exports.processUpdateUserRole = async (req, res, next) => {
    let user_id = req.params.userId
    let data = req.body.data
    try {
        await role.deleteUserRoles(user_id);
        if (data != null) {
            for (i = 0; i < data.length; i++) {
                await role.insertUserRole(user_id, data[i].value);
            }
        }
        return res.status(200).send('Sucessfully updated');
    } catch (error) {
        // let message = 'Server is unable to process your request.';
        // return res.status(500).send({
        //     message: error
        // });
        next(error);
    }

}; //End of processGetUserRole