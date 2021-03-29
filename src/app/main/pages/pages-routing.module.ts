import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageGuard } from '@fuse/services/auth.guard';
import { authRole } from '../../../constants/globalFunctions';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [

    { 
      path: 'dashboard',
      canLoad: [PageGuard],
      loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      data: {
        roles: Object.values(authRole).filter(item => typeof item === 'number')
      }
    },
    { path: 'partner', 
      canLoad: [PageGuard],
      loadChildren: () => import('./partner/partner.module').then(m => m.PartnerModule),
      data: {
        roles: [authRole.admin]
      }
    },
    { path: 'reseller', 
      canLoad: [PageGuard],
      loadChildren: () => import('./reseller/reseller.module').then(m => m.ResellerModule),
      data: {
        roles: [
          authRole.admin,
          authRole.partner
        ]
      }
    },
    { path: 'merchant',
      canLoad: [PageGuard],
      loadChildren: () => import('./merchant/merchant.module').then(m => m.MerchantModule),
      data: {
        roles: [
          authRole.admin,
          authRole.partner,
          authRole.reseller
        ]
      }
    },
    { path: 'sale', 
      canLoad: [PageGuard],
      loadChildren: () => import('./sale/sale.module').then(m => m.SaleModule),
      data: {
        roles: Object.values(authRole).filter(item => typeof item === 'number')
      }
    },
    { path: 'report-manager',
      canLoad: [PageGuard],
      loadChildren: () => import('./report-manager/report-manager.module').then(m => m.ReportManagerModule),
      data: {
        roles: Object.values(authRole).filter(item => typeof item === 'number')
      }
    },
    { path: 'transaction', 
      canLoad: [PageGuard],
      loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionModule),
      data: {
        roles: Object.values(authRole).filter(item => typeof item === 'number')
      }
    },
    { path: 'disputes', 
      canLoad: [PageGuard],
      loadChildren: () => import('./disputes/disputes.module').then(m => m.DisputesModule),
      data: {
        roles: Object.values(authRole).filter(item => typeof item === 'number')
      }
    },
    { path: 'pricing-plan', 
      canLoad: [PageGuard],
      loadChildren: () => import('./pricing-plan/pricing-plan.module').then(m => m.PricingPlanModule),
      data: {
        roles: [
          authRole.admin,
          authRole.partner,
          authRole.reseller
        ]
      }
    },
    { path: 'funds', 
      canLoad: [PageGuard],
      loadChildren: () => import('./funding-manager/funding-manager.module').then(m => m.FundingManagerModule),
      data: {
        roles: [
          authRole.admin
        ]
      }
    },
    { path: 'user',
      canLoad: [PageGuard],
      loadChildren: () => import('./user/user.module').then(m => m.UserModule),
      data: {
        roles: [
          authRole.admin,
          authRole.partner,
          authRole.reseller,
          authRole.merchant
        ]
      }
    },
    { path: 'user-permissions',
      canLoad: [PageGuard],
      loadChildren: () => import('./user-permissions/user-permissions.module').then(m => m.UserPermissionsModule),
      data: {
        roles: [
          authRole.admin,
          authRole.partner,
          authRole.reseller,
          authRole.merchant
        ]
      }
    },
    { path: 'plg-management',
      canLoad: [PageGuard],
      loadChildren: () => import('./plg-management/plg-management.module').then(m => m.PlgManagementModule),
      data: {
        roles: [
          authRole.admin,
          authRole.partner,
        ]
      }
    },
    { path: 'settings',
      canLoad: [PageGuard],
      loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
      data: {
        roles: Object.values(authRole).filter(item => typeof item === 'number')
      }
    },
    { path: 'fraud-mgmt',
      canLoad: [PageGuard],
      loadChildren: () => import('./fraud-mgmt/fraud-mgmt.module').then(m => m.FraudMgmtModule),
      data: {
        roles: Object.values(authRole).filter(item => typeof item === 'number')
      }
    },
    { 
      path: 'twofactor',
      canLoad: [PageGuard],
      loadChildren: () => import('./twofactor/twofactor.module').then(m => m.TwofactorModule),
      data: {
        roles: Object.values(authRole).filter(item => typeof item === 'number')
      }
    },
    { path: 'last-activity',
    canLoad: [PageGuard],
    loadChildren: () => import('./last-activity/last-activity.module').then(m => m.LastActivityModule),
    data: {
      roles: Object.values(authRole).filter(item => typeof item === 'number')
    }
  },
    { path: '**', redirectTo: 'dashboard' }
  ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
