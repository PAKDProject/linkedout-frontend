import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Select } from '@ngxs/store';
import { UserState } from 'src/redux/states/user.state';
import { Observable } from 'rxjs';
import { IUser } from 'src/models/user-model';
import { CognitoWebTokenAuthService } from 'src/services/cognito-auth/cognito-web-token-auth.service';
import { NotificationService } from 'src/services/notifications/notification.service';
import { UserService } from 'src/services/user-service/user.service';
import { MatMenuTrigger } from '@angular/material';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: 'user-dashboard', title: 'User Dashboard', icon: 'dashboard', class: '' },
    { path: 'browse-jobs', title: 'Browse Jobs', icon: 'find_in_page', class: '' },
    // { path: 'messages', title: 'Messaging', icon: 'message', class: '' },
    { path: 'organization-dashboard', title: 'Organization Dashboard', icon: 'group', class: '' },
    { path: 'user-profile', title: 'My Profile', icon: 'face', class: '' }
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {
    @Select(UserState.getUser) user$: Observable<IUser>
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    menuItems: any[];
    userFName: string;
    search: string;
    results: IUser[];

    constructor(
        private _auth: CognitoWebTokenAuthService,
        private _notifier: NotificationService,
        private _userService: UserService
    ) { }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.user$.subscribe(res => {
            this.userFName = res.fName;

        })


    }
    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    logOut() {
        this._auth.logout().subscribe(res => {
            this._notifier.showInfo("Bye " + this.userFName);
            window.location.href = "http://login.elance.site"
        }, err => {
            this._notifier.showError("Failed to logout!")
        })
    }

    searchUsers() {
        this._userService.searchUsers(this.search).subscribe((data) => {
            console.log(data);
        });
    }

    showResults(searchTerm: string) {
        //Killian - hook up the search here and pop the results into the results variable plz
        this._userService.getAllUsers().subscribe(res => {
            this.results = res;
            this.results = this.results.filter(res => res.fName.includes(searchTerm))
            this.trigger.openMenu();
        })

    }
}