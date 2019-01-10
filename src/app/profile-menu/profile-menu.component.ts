import { Component, OnInit } from "@angular/core";
import { IUser, IEducationItem, ISocialLink } from "src/models/user-model";
import { Observable } from "rxjs";
import { Select, Store } from "@ngxs/store";
import { UserState } from "src/redux/states/user.state";
import { ISkills } from "src/models/skill-model";
import { NotificationService } from "src/services/notifications/notification.service";
import { RequestUpdateUser } from "src/redux/actions/user.actions";

@Component({
  selector: "app-profile-menu",
  templateUrl: "./profile-menu.component.html",
  styleUrls: ["./profile-menu.component.scss"]
})
export class ProfileMenuComponent implements OnInit {
  @Select(UserState.getUser) user$: Observable<IUser>;
  skills: ISkills[];
  educationItems: IEducationItem[];
  socialLinks: ISocialLink[];
  user: Partial<IUser> = {};

  constructor(private _notify: NotificationService, private store: Store) { }

  ngOnInit() {
    this.user$.subscribe(element => {
      this.skills = element.skills;
      this.educationItems = element.educationItems;
      this.socialLinks = element.socialLinks;

      this.user = {
        fName: element.fName,
        lName: element.lName,
        tagline: element.tagline,
        summary: element.summary,
        educationItems: element.educationItems,
        skills: element.skills
      };
    });
  }

  editing: boolean = false;
  toggleEditing() {
    if (this.editing) {
      this.store.dispatch(new RequestUpdateUser(this.user)).subscribe(res => {
        this.editing = !this.editing
      });
    }
    else {
      this._notify.showInfo(
        "You are now editing the page",
        "Click on a field to begin editing. NOTE: You cannot change your email."
      );
      this.editing = !this.editing
    }
  }

  removeSkill(rSkill) {
    const index: number = this.skills.findIndex(skill => {
      return skill === rSkill;
    });
    alert(index);

    if (index != -1) {
      this.skills.splice(index, 1);
    }
  }

  updateSkills(updatedSkill: ISkills) {
    this.skills.forEach(skill => {
      if (skill.skillTitle === updatedSkill.skillTitle) {
        skill = updatedSkill;
      }
    });
  }

  summaryEdit: boolean = false;
  toggleEditSummary() {
    this.summaryEdit = !this.summaryEdit;
  }

  addToEducationList(e: { old: IEducationItem, new: IEducationItem }) {
    if (this.educationIsNotNull(e.new)) {
      return
    }
    else if (e.old === null) {
      this.user.educationItems.push(e.new)
    }
    else {
      let index = this.user.educationItems.findIndex((item) => {
        return item === e.old
      })

      this.user.educationItems[index] = e.new
    }
  }

  addToSkills(e: ISkills[]) {
    this.user.skills.push(...e);
  }

  educationIsNotNull(e: IEducationItem): boolean {
    let isNotNull: boolean = true
    Object.getOwnPropertyNames(e).forEach(prop => {
      if (e[prop] !== null)
        isNotNull = false
    })
    return isNotNull
  }
}