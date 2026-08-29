import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Detail } from './detail/detail';
import { Create } from './create/create';

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
];
