import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from 'src/components/home.component';

import { TxDetailsComponent, TxListComponent } from '../components/tx';
import { MapComponent, NavigationComponent, HeaderStatsComponent, FooterStatsComponent } from '../components/common';
import { BlockDetailsComponent, BlockListComponent } from '../components/block';
import { NodeCardComponent, NodeDetailsComponent, NodeListComponent, ConsensusNodesListComponent } from '../components/nodes';

// Services
import { NetService } from '../core/services';
import { NodeRpcService, NodeService, BlockService } from '../core/services/data';
import { SignalRService } from '../core/services/signal-r/signal-r.service';
import {
  NodesSignalRService, BlocksSignalRService,
  TransAvgCountSignalRService, FailP2PSignalRService, TransCountSignalRService
} from '../core/services/signal-r';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapComponent, NavigationComponent, HeaderStatsComponent, FooterStatsComponent,
    NodeCardComponent, NodeDetailsComponent, NodeListComponent, ConsensusNodesListComponent,
    BlockListComponent, BlockDetailsComponent,
    TxDetailsComponent, TxListComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'nodes', component: NodeListComponent },
      { path: 'node/:id', component: NodeDetailsComponent },
      { path: 'blocks', component: BlockListComponent },
      { path: 'block/:hash', component: BlockDetailsComponent },
      { path: 'transactions', component: TxListComponent },
      { path: 'transaction/:hash', component: TxDetailsComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' }
    ])
  ],
  providers: [
    // Common services
    NetService,
    // SignalR services
    SignalRService,
    NodesSignalRService, BlocksSignalRService,
    TransCountSignalRService, TransAvgCountSignalRService, FailP2PSignalRService,
    // Data services
    NodeRpcService, NodeService, BlockService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
