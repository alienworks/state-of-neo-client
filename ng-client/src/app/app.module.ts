import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { SelectDropDownModule } from 'ngx-select-dropdown';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from 'src/components/home.component';

import {
  TxDetailsComponent, TxListComponent, TxIndexComponent, TxIconComponent,
  TotalGasClaimedComponent, TxListTableComponent, TxUnconfirmedComponent, SmallTxListTableComponent, TxSmallListComponent,
} from '../components/tx';
import {
  MapComponent, MapGraphComponent, NavigationComponent, HeaderStatsComponent,
  FooterStatsComponent, DateBarChartComponent, PieChartComponent,
  LoaderComponent, FooterStatsBoxComponent, FooterStatsTrComponent, PercentBarComponent, HorizontalBarChartComponent, SearchComponent
} from '../components/common';
import { BlockDetailsComponent, BlockListComponent, BlockListTableComponent } from '../components/block';
import { NodeCardComponent, NodeDetailsComponent, NodeListComponent, ConsensusNodesListComponent } from '../components/nodes';
import {
  AddressIndexComponent, AddressDetailsComponent, AddressListComponent,
  AddressListItemComponent, AddressTopComponent, AddressListTableComponent, AddressTopTableComponent
} from '../components/address';
import {
  AssetDetailsComponent, AssetIndexComponent, AssetListComponent, AssetListTableComponent
} from '../components/asset';

// Services
import { NetService, CommonStateService } from '../core/services';
import {
  RpcService, NodeService, BlockService, TxService, ChartService, AddressService, AssetService, SearchService
} from '../core/services/data';
import { SignalRService } from '../core/services/signal-r/signal-r.service';
import {
  StatsSignalRService, NotificationsSignalRService
} from '../core/services/signal-r';

import { TimeAgoPipe } from 'time-ago-pipe';
import { TimestampFormatPipe } from '../core/pipes';
import { NotificationsIndexComponent, NotificationsListComponent } from 'src/components/notification';
import { BlockIndexComponent } from '../components/block/block-index.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    // Common
    MapComponent, MapGraphComponent, NavigationComponent, HeaderStatsComponent, FooterStatsComponent, FooterStatsBoxComponent,
    FooterStatsTrComponent, DateBarChartComponent, LoaderComponent, PieChartComponent, PercentBarComponent,
    HorizontalBarChartComponent, SearchComponent,
    // Nodes
    NodeCardComponent, NodeDetailsComponent, NodeListComponent, ConsensusNodesListComponent,
    // Block
    BlockListComponent, BlockDetailsComponent, BlockIndexComponent, BlockListTableComponent,
    // Address
    AddressListComponent, AddressDetailsComponent, AddressIndexComponent, AddressListItemComponent,
    AddressTopComponent, AddressListTableComponent, AddressTopTableComponent,
    // Assets
    AssetDetailsComponent, AssetIndexComponent, AssetListComponent, AssetListTableComponent,
    // Transactions
    TxIndexComponent, TxDetailsComponent, TxListComponent, TxIconComponent, TotalGasClaimedComponent,
    TxListTableComponent, SmallTxListTableComponent, TxUnconfirmedComponent, TxSmallListComponent,
    // Notifications
    NotificationsIndexComponent, NotificationsListComponent,
    // Libs
    TimeAgoPipe,
    // Custom pipes
    TimestampFormatPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    NgxPaginationModule,
    SelectDropDownModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'nodes', component: NodeListComponent },
      { path: 'node/:id', component: NodeDetailsComponent },
      { path: 'address', component: AddressIndexComponent },
      { path: 'address/:address', component: AddressDetailsComponent },
      { path: 'asset', component: AssetIndexComponent },
      { path: 'asset/:hash', component: AssetDetailsComponent },
      { path: 'blocks', component: BlockIndexComponent },
      { path: 'block/:index', component: BlockDetailsComponent },
      { path: 'transactions', component: TxIndexComponent },
      { path: 'transaction/:hash', component: TxDetailsComponent },
      { path: 'transaction/:hash/:nodeid', component: TxUnconfirmedComponent },
      { path: 'notifications', component: NotificationsIndexComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' }
    ])
  ],
  providers: [
    // NG
    DatePipe,
    // Custom
    TimestampFormatPipe,
    // Common services
    NetService, CommonStateService,
    // SignalR services
    SignalRService,
    StatsSignalRService, NotificationsSignalRService,
    // Data services
    RpcService,
    NodeService, BlockService, TxService, ChartService, AddressService, AssetService, SearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
