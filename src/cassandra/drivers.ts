import { getClient, keyspace } from './client';

export interface IDriver {
  id?: string;
  createdAt?: Date;
  createdFrom?: string;
  email?: string;
  emailConfirmed?: boolean;
  password?: string;
  phoneNumber?: string;
  phoneConfirmed?: boolean;
  firstName?: string;
  lastName?: string;
  city?: string;
  companyName?: string;
  vatNumber?: string;
  companyAddress?: string;
  companyCity?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehiclePlateNumber?: string;
  vehicleColor?: string;
  profileImageUrl?: string;
  licenseImageUrl?: string;
  vehicleImageUrl?: string;
  davId?: string;
  privateKey?: Buffer;
}

export interface IPersonalDetails {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  profileImageUrl: string;
  licenseImageUrl: string;
}

export interface ICompanyDetails {
  id?: string;
  companyName?: string;
  vatNumber?: string;
  companyAddress?: string;
  companyCity?: string;
}

export interface IVehicleDetails {
  id?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehiclePlateNumber?: string;
  vehicleColor?: string;
  vehicleImageUrl?: string;
}

export function list(): Promise<IDriver[]> {
  return getClient().execute('', {}, {}).then(r => []);
}

export function findById(id: string): Promise<IDriver> {
  return getClient().execute(`SELECT * from ${keyspace}.drivers WHERE id=?`, [id], { prepare: true }).then((res): IDriver => {
    const first = res.first();
    return {
      id: first.id.toString(),
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

export function findByEmail(email: string): Promise<IDriver> {
  return getClient().execute(`SELECT * from ${keyspace}.drivers_email WHERE email=?`, [email], { prepare: true }).then((res): IDriver => {
    const first = res.first();
    return first ? {
      id: first.id.toString(),
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
    } : null;
  });
}

export function insert(driver: IDriver): Promise<void> {
  return getClient().execute(`INSERT INTO ${keyspace}.drivers (id,created_at,created_from,email,
        email_confirmed,password,phone_number,phone_confirmed,first_name,last_name,city,company_name,vat_number,
        company_address,company_city,vehicle_make,vehicle_model,vehicle_year,vehicle_plate_number,
        vehicle_color,profile_image_id,license_image_id,vehicle_image_id,dav_id,private_key)
    VALUES (?,dateof(now()),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`, [
            driver.id, driver.createdFrom, driver.email, driver.emailConfirmed, driver.password, driver.phoneNumber,
            driver.phoneConfirmed, driver.firstName, driver.lastName, driver.city, driver.companyName, driver.vatNumber,
            driver.companyAddress, driver.companyCity, driver.vehicleMake, driver.vehicleModel, driver.vehicleYear,
            driver.vehiclePlateNumber, driver.vehicleColor, driver.profileImageUrl, driver.licenseImageUrl, driver.vehicleImageUrl,
            driver.davId, driver.privateKey], { prepare: true })
        .then(res => {/**/ });
}

export function update(driver: IDriver): Promise<void> {
  return getClient().execute(`UPDATE ${keyspace}.drivers SET
        ${[
      !!driver.createdAt ? `created_at=${driver.createdAt}` : null,
      !!driver.createdFrom ? `created_from='${driver.createdFrom}'` : null,
      !!driver.email ? `email='${driver.email}'` : null,
      // TODO: Add all other fields
    ].filter(s => !!s).join(',')}
        WHERE id=${driver.id};`)
    .then(res => {/**/ });
}

export function updatePersonalDetails(personalDetails: IPersonalDetails): Promise<void> {
  return getClient().execute(`UPDATE ${keyspace}.drivers SET
      email = ?,
      first_name = ?,
      last_name = ?,
      city = ?,
      profile_image_id = ?,
      license_image_id = ?
    WHERE id = ?;`,
    [
      personalDetails.email,
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.city,
      personalDetails.profileImageUrl,
      personalDetails.licenseImageUrl,
      personalDetails.id,
    ], { prepare: true })
    .then(res => { /* */ });
}

export function updateCompanyDetails(companyDetails: ICompanyDetails): Promise<void> {
  return getClient().execute(`UPDATE ${keyspace}.drivers SET
      company_address = ?,
      company_city = ?,
      company_name = ?,
      vat_number = ?
    WHERE id = ?;`,
    [
      companyDetails.companyAddress,
      companyDetails.companyCity,
      companyDetails.companyName,
      companyDetails.vatNumber,
      companyDetails.id,
    ], { prepare: true })
    .then(res => { /* */ });
}

export function updateVehicleDetails(vehicleDetails: IVehicleDetails): Promise<void> {
  return getClient().execute(`UPDATE ${keyspace}.drivers SET
      vehicle_make = ?,
      vehicle_model = ?,
      vehicle_year = ?,
      vehicle_plate_number = ?,
      vehicle_color = ?,
      vehicle_image_id = ?
    WHERE id = ?;`,
    [
      vehicleDetails.vehicleMake,
      vehicleDetails.vehicleModel,
      vehicleDetails.vehicleYear,
      vehicleDetails.vehiclePlateNumber,
      vehicleDetails.vehicleColor,
      vehicleDetails.vehicleImageUrl,
      vehicleDetails.id,
    ], { prepare: true })
    .then(res => { /* */ });
}
