import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'expectation-maximization',
        loadChildren: '../app/Dashboard/em/em.module#EmModule'
        // canActivate:[AuthGuard]
    }/// ,
    // {
    //     path: '',
    //     redirectTo: '/expectation-maximization',
    //     pathMatch: 'full'
    //     // canActivate:[AuthGuard]
    // }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class RoutingModule { }
