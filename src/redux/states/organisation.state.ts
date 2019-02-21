import { IOrganisation } from "src/models/organisation-model";
import { State, Selector, Action, Store, StateContext } from "@ngxs/store";
import { CreateOrganisation, CreateOrganisationSuccess, CreateOrganisationFail, SetOrganisations, UpdateOrganisation, UpdateOrganisationSuccess, UpdateOrganisationFail, DeleteOrganisation, DeleteOrganisationSuccess, DeleteOrganisationFail, OrgAddPostedJob, AddActiveJobToOrg, AddContactToOrg } from "../actions/organisation.actions";
import { OrganisationService } from "src/services/organisation-service/organisation.service";
import { RequestAddOrgToUser, RequestUpdateUserOrg, RequestDeleteOrgFromUser } from "../actions/user.actions";

export class OrgsStateModel {
  orgs: Partial<IOrganisation>[];
}

@State({
  name: "orgs",
  defaults: {
    orgs: []
  }
})

export class OrgsState {
  constructor(
    private _orgService: OrganisationService,
    private _store: Store) { }

  //#region Selector and Initial Set
  @Selector()
  static getOrgs(state: OrgsStateModel) {
    return state.orgs;
  }

  //Sets organisations at the start of app running
  //Receives array of organisations and appends them to array
  @Action(SetOrganisations)
  setOrganisations({ getState, patchState }: StateContext<OrgsStateModel>, { payload }: SetOrganisations) {
    let newState = getState().orgs || [];
    newState.push(...payload);
    patchState({ orgs: newState });
  }
  //#endregion

  //#region Create Organisation
  @Action(CreateOrganisation)
  createOrg({ dispatch }: StateContext<OrgsStateModel>, { payload }: CreateOrganisation) {
    if (payload) {
      this._orgService.createOrganisation(payload).subscribe(res => {
        dispatch(new CreateOrganisationSuccess(res));
      }),
        err => {
          dispatch(new CreateOrganisationFail(err.message));
        }
    }
  }
  @Action(CreateOrganisationSuccess)
  createOrgSuccess({ getState, patchState }: StateContext<OrgsStateModel>, { payload }: CreateOrganisationSuccess) {
    let orgs = getState().orgs;

    const partialJob: Partial<IOrganisation> = {
      id: payload.id,
      orgName: payload.orgName,
      logoUrl: payload.logoUrl,
      adminUser: payload.adminUser
    }

    orgs.push(partialJob);

    this._store.dispatch(new RequestAddOrgToUser(partialJob));

    patchState({ orgs: orgs });
  }
  @Action(CreateOrganisationFail)
  createOrgFail({ errorMessage }: CreateOrganisationFail) {
  }
  //#endregion

  //#region Update Organisation
  @Action(UpdateOrganisation)
  UpdateOrganisation({ dispatch }: StateContext<OrgsStateModel>, { payload, orgId }: UpdateOrganisation) {
    if (orgId && payload) {
      this._orgService.updateOrganisation(payload, orgId).subscribe((res) => {
        dispatch(new UpdateOrganisationSuccess(res));
      }, error => {
        dispatch(new UpdateOrganisationFail(error.message));
      })
    }
  }

  @Action(UpdateOrganisationSuccess)
  UpdateOrganisationSuccess({ getState, patchState, dispatch }: StateContext<OrgsStateModel>, { payload }: UpdateOrganisationSuccess) {
    const orgs = getState().orgs;

    const partial: Partial<IOrganisation> = {
      id: payload.id,
      orgName: payload.orgName,
      logoUrl: payload.logoUrl
    };

    dispatch(new RequestUpdateUserOrg(partial));
    partial.adminUser = payload.adminUser;

    const index = orgs.findIndex(org => org.id === payload.id);

    orgs[index] = partial;

    patchState({ orgs: orgs });

  }

  @Action(UpdateOrganisationFail)
  UpdateOrganisationFail({ patchState }: StateContext<OrgsStateModel>, { errorMessage }: UpdateOrganisationFail) {
  }

  //#endregion

  //#region Delete Org
  @Action(DeleteOrganisation)
  DeleteOrganisation({ getState, dispatch }: StateContext<OrgsStateModel>, { payload }: DeleteOrganisation) {
    const orgs = getState().orgs;

    if (orgs.findIndex(org => org.id === payload) !== -1) {
      this._orgService.deleteOrganisation(payload).subscribe(res => {
        dispatch(new DeleteOrganisationSuccess(res.id));
      }, error => {
        dispatch(new DeleteOrganisationFail(error.message));
      });
    }
  }
  @Action(DeleteOrganisationSuccess)
  DeleteOrganisationSuccess({ getState, patchState, dispatch }: StateContext<OrgsStateModel>, { payload }: DeleteOrganisationSuccess) {
    const orgs = getState().orgs;

    const updatedOrgs = orgs.filter(org => org.id !== payload);
    dispatch(new RequestDeleteOrgFromUser(payload));
    patchState({ orgs: updatedOrgs });
  }
  @Action(DeleteOrganisationFail)
  DeleteOrganisationFail({ patchState }: StateContext<OrgsStateModel>, { errorMessage }: DeleteOrganisationFail) {
  }

  //#endregion

  @Action(OrgAddPostedJob)
  OrgAddPostedJob({ getState, patchState }: StateContext<OrgsStateModel>, { payload, orgId }: OrgAddPostedJob) {
    const orgs = getState().orgs;

    const index = orgs.findIndex(o => o.id === orgId);

    if (index !== -1) {
      this._orgService.getOrganisationByID(orgId).subscribe((res) => {
        if (res) {
          const postedJobs = res.jobsPosted || [];

          postedJobs.push(payload);

          this._orgService.updateOrganisation({ jobsPosted: postedJobs }, orgId).subscribe(res => {
            orgs[index] = res;

            patchState({ orgs: orgs })
          })
        }
        else {
          console.log('Error returning from server')
        }
      })
    }
  }

  @Action(AddActiveJobToOrg)
  AddActiveJobToOrg({ getState, patchState }: StateContext<OrgsStateModel>, { payload, orgId }: AddActiveJobToOrg) {
    const orgs = getState().orgs;

    const index = orgs.findIndex(o => o.id === orgId);

    if (index != -1) {
      this._orgService.getOrganisationByID(orgId).subscribe((res) => {
        if (res) {
          const activeJobs = res.activeJobs || [];
          const postedJobs = res.jobsPosted || [];



          activeJobs.push(payload);
          const indexToRemove = postedJobs.findIndex(p => p.id === payload.id);
          postedJobs.splice(indexToRemove, 1);
          this._orgService.updateOrganisation({ activeJobs: activeJobs, jobsPosted: postedJobs }, orgId).subscribe((res) => {
            orgs[index] = res;
            patchState({ orgs: orgs })
          })
        }
      })
    }

  }
  @Action(AddContactToOrg)
  addContactToOrg({ getState, patchState }: StateContext<OrgsStateModel>, { payload, orgId }: AddContactToOrg) {
    //email, avatarurl, fname, lname, tagline, id
    const orgs = getState().orgs;

    const index = orgs.findIndex(o => o.id === orgId);

    if (index != -1) {


      this._orgService.getOrganisationByID(orgId).subscribe(res => {
        const org = res;

        const contacts = org.contacts || [];

        if (contacts.findIndex(p => p.id === payload.id) === -1) {

          contacts.push(payload);

          this._orgService.updateOrganisation({ contacts: contacts }, orgId).subscribe((res) => {
            orgs[index] = res;

            patchState({ orgs: orgs });
          })
        }
      })
    }
  }
}



