import { Route } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UserProfileResolver } from './user-profile.resolver';
// import { EditProfileComponent } from './edit-profile/edit-profile.component';

export const userProfileRoutes: Route[] = [
    {
        path        : '',
        component   : EditProfileComponent,
        data        : {
            headerTitle: 'My Profile'
        },
        resolve     : {
            userProfile: UserProfileResolver
        }
    }
];
