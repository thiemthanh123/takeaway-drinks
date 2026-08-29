import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Detail } from './detail/detail';
import { Create } from './create/create';
import { LifecycleChild } from './lifecycle-child/lifecycle-child';
import { LifecycleParent } from './lifecycle-parent/lifecycle-parent';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./home/home').then(m => m.Home)
    },
    {
        path: 'detail/:id',
        loadComponent: () =>
            import('./detail/detail').then(m => m.Detail)
    },
    {
        path: 'create',
        loadComponent: () =>
            import('./create/create').then(m => m.Create)
    },
    {
        path: 'child',
        loadComponent: () =>
            import('./lifecycle-child/lifecycle-child').then(m => m.LifecycleChild)
    },
];
