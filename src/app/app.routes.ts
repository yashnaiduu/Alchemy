import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Dashboard } from './components/dashboard/dashboard';
import { Browse } from './components/browse/browse';
import { Details } from './components/details/details';
import { MyBar } from './components/my-bar/my-bar';
import { Parent } from './common/parent/parent';
import { About } from './components/about/about';

export const routes: Routes = [
    { path: '', component: Home },
    {
        path: '', component: Parent, children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'my-bar', component: MyBar },
            { path: 'browse', component: Browse, data: { type: 'favourite' } },
            { path: 'browse/:id', component: Details },
            { path: 'favourite', component: Browse, data: { type: 'favourite' } },
            { path: 'about', component: About }
        ]
    }
];
