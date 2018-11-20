import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from 'src/components/home.component';

import {
  TxDetailsComponent, TxListComponent, TxIndexComponent, TxIconComponent,
  TotalGasClaimedComponent, TxListTableComponent, TxUnconfirmedComponent
} from '../components/tx';
import {
  MapComponent, NavigationComponent, HeaderStatsComponent,
  FooterStatsComponent, DateBarChartComponent, PieChartComponent,
  LoaderComponent, FooterStatsBoxComponent, FooterStatsTrComponent
} from '../components/common';
import { BlockDetailsComponent, BlockListComponent } from '../components/block';
import { NodeCardComponent, NodeDetailsComponent, NodeListComponent, ConsensusNodesListComponent } from '../components/nodes';
import {
  AddressIndexComponent, AddressDetailsComponent, AddressListComponent,
  AddressListItemComponent, AddressTopComponent, AddressListTableComponent, AddressTopTableComponent
} from '../components/address';
import {
  AssetDetailsComponent, AssetIndexComponent, AssetListComponent, AssetListTableComponent
} from '../components/asset';

// Services
import { NetService } from '../core/services';
import {
  RpcService, NodeService, BlockService, TxService, ChartService, AddressService, AssetService
} from '../core/services/data';
import { SignalRService } from '../core/services/signal-r/signal-r.service';
import {
  NodesSignalRService, BlocksSignalRService, FailP2PSignalRService, StatsSignalRService
} from '../core/services/signal-r';

import { TimeAgoPipe } from 'time-ago-pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    // Common
    MapComponent, NavigationComponent, HeaderStatsComponent, FooterStatsComponent, FooterStatsBoxComponent,
    FooterStatsTrComponent, DateBarChartComponent, LoaderComponent, PieChartComponent,
    // Nodes
    NodeCardComponent, NodeDetailsComponent, NodeListComponent, ConsensusNodesListComponent,
    // Block
    BlockListComponent, BlockDetailsComponent,
    // Address
    AddressListComponent, AddressDetailsComponent, AddressIndexComponent, AddressListItemComponent,
    AddressTopComponent, AddressListTableComponent, AddressTopTableComponent,
    // Assets
    AssetDetailsComponent, AssetIndexComponent, AssetListComponent, AssetListTableComponent,
    // Transactions
    TxIndexComponent, TxDetailsComponent, TxListComponent, TxIconComponent, TotalGasClaimedComponent,
    TxListTableComponent, TxUnconfirmedComponent,
    // Libs
    TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    NgxPaginationModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'nodes', component: NodeListComponent },
      { path: 'node/:id', component: NodeDetailsComponent },
      { path: 'address', component: AddressIndexComponent },
      { path: 'address/:address', component: AddressDetailsComponent },
      { path: 'asset', component: AssetIndexComponent },
      { path: 'asset/:hash', component: AssetDetailsComponent },
      { path: 'blocks', component: BlockListComponent },
      { path: 'block/:index', component: BlockDetailsComponent },
      { path: 'transactions', component: TxIndexComponent },
      { path: 'transaction/:hash', component: TxDetailsComponent },
      { path: 'transaction/:hash/:nodeid', component: TxUnconfirmedComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' }
    ])
  ],
  providers: [
    // NG
    DatePipe,
    // Common services
    NetService,
    // SignalR services
    SignalRService,
    NodesSignalRService, BlocksSignalRService, AddressService, AssetService,
    StatsSignalRService, FailP2PSignalRService,
    // Data services
    RpcService,
    NodeService, BlockService, TxService, ChartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
