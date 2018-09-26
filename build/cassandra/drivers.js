"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
function list() {
    return client_1.getClient().execute('', {}, {}).then(r => []);
}
exports.list = list;
function findById(id) {
    return client_1.getClient().execute(`SELECT * from ${client_1.keyspace}.drivers WHERE id=?`, [id], { prepare: true }).then((res) => {
        const first = res.first();
        return {
            id: first.id,
            createdAt: first.created_at,
            createdFrom: first.created_from,
            email: first.email,
            emailConfirmed: first.email_confirmed,
            password: first.password,
            phoneNumber: first.phone_number,
            phoneConfirmed: first.phone_confirmed,
            firstName: first.first_name,
            lastName: first.last_name,
            city: first.city,
            companyName: first.company_name,
            vatNumber: first.vat_number,
            companyAddress: first.company_address,
            companyCity: first.company_city,
            vehicleMake: first.vehicle_make,
            vehicleModel: first.vehicle_model,
            vehicleYear: first.vehicle_year,
            vehiclePlateNumber: first.vehicle_plate_number,
            vehicleColor: first.vehicle_color,
            profileImageUrl: first.profile_image_id,
            licenseImageUrl: first.license_image_id,
            vehicleImageUrl: first.vehicle_image_id,
            davId: first.dav_id,
            privateKey: first.private_key,
        };
    });
}
exports.findById = findById;
function insert(driver) {
    return client_1.getClient().execute(`INSERT INTO ${client_1.keyspace}.drivers (id,created_at,created_from,email,
        email_confirmed,password,phone_number,phone_confirmed,first_name,last_name,city,company_name,vat_number,
        company_address,company_city,vehicle_make,vehicle_model,vehicle_year,vehicle_plate_number,
        vehicle_color,profile_image_id,license_image_id,vehicle_image_id,dav_id,private_key)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`, [
        driver.id, driver.createdAt, driver.createdFrom, driver.email, driver.emailConfirmed, driver.password, driver.phoneNumber,
        driver.phoneConfirmed, driver.firstName, driver.lastName, driver.city, driver.companyName, driver.vatNumber,
        driver.companyAddress, driver.companyCity, driver.vehicleMake, driver.vehicleModel, driver.vehicleYear,
        driver.vehiclePlateNumber, driver.vehicleColor, driver.profileImageUrl, driver.licenseImageUrl, driver.vehicleImageUrl,
        driver.davId, driver.privateKey
    ], { prepare: true })
        .then(res => { });
}
exports.insert = insert;
function update(driver) {
    return client_1.getClient().execute(`UPDATE ${client_1.keyspace}.drivers SET
        ${[
        !!driver.createdAt ? `created_at=${driver.createdAt}` : null,
        !!driver.createdFrom ? `created_from='${driver.createdFrom}'` : null,
        !!driver.email ? `email='${driver.email}'` : null,
    ].filter(s => !!s).join(',')}
        WHERE id=${driver.id};`)
        .then(res => { });
}
exports.update = update;
