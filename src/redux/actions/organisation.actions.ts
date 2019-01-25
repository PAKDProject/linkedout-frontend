import { IOrganisation } from "src/models/organisation-model";

//#region Set Organisations
export class SetOrganisations {
  static readonly type = '[Orgs] Set Organisations';
  constructor(public payload: IOrganisation[]) { }
}
//#endregion
//#region Create organisation
export class CreateOrganisation {
  static readonly type = '[Orgs] Create Organisation'
  constructor(public payload: IOrganisation) {
  }
}
export class CreateOrganisationSuccess {
  static readonly type = '[Orgs] Create Organisation Success'
  constructor(public payload: IOrganisation) { }
}
export class CreateOrganisationFail {
  static readonly type = '[Orgs] Create Organisation Fail'
  constructor(public errorMessage: string) { }
}
//#endregion
