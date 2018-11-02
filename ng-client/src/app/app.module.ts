import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from 'src/components/home.component';

import { TxDetailsComponent, TxListComponent, TxIndexComponent, TxIconComponent } from '../components/tx';
import { MapComponent, NavigationComponent, HeaderStatsComponent, FooterStatsComponent, DateBarChartComponent } from '../components/common';
import { BlockDetailsComponent, BlockListComponent } from '../components/block';
import { NodeCardComponent, NodeDetailsComponent, NodeListComponent, ConsensusNodesListComponent } from '../components/nodes';

// Services
import { DatePipe } from '@angular/common';
import { NetService } from '../core/services';
import { NodeRpcService, NodeService, BlockService, TxService, ChartService } from '../core/services/data';
import { SignalRService } from '../core/services/signal-r/signal-r.service';
import {
  NodesSignalRService, BlocksSignalRService,
  TransAvgCountSignalRService, FailP2PSignalRService, TransCountSignalRService
} from '../core/services/signal-r';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapComponent, NavigationComponent, HeaderStatsComponent, FooterStatsComponent, DateBarChartComponent,
    NodeCardComponent, NodeDetailsComponent, NodeListComponent, ConsensusNodesListComponent,
    BlockListComponent, BlockDetailsComponent,
    TxIndexComponent, TxDetailsComponent, TxListComponent, TxIconComponent
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
      { path: 'blocks', component: BlockListComponent },
      { path: 'block/:index', component: BlockDetailsComponent },
      { path: 'transactions', component: TxIndexComponent },
      { path: 'transaction/:hash', component: TxDetailsComponent },
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
    NodesSignalRService, BlocksSignalRService,
    TransCountSignalRService, TransAvgCountSignalRService, FailP2PSignalRService,
    // Data services
    NodeRpcService, NodeService, BlockService, TxService, ChartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
