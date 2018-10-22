import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from 'src/components/home.component';

import { SignalRService } from 'src/core/services/signal-r.service';
import { NodesSignalRService } from 'src/core/services/nodes-signal-r.service';
import { BlocksSignalRService } from 'src/core/services/blocks-signal-r.service';
import { NodeRpcService } from 'src/core/services/node-rpc.service';
import { TransCountSignalRService } from 'src/core/services/trans-count-signal-r.service';
import { TransAvgCountSignalRService } from 'src/core/services/trans-avg-count-signal-r.service';
import { FailP2PSignalRService } from 'src/core/services/fail-p2p-signal-r.service';
import { NodeService } from 'src/core/services/node.service';
import { BlockService } from 'src/core/services/block.service';
import { TxDetailsComponent, TxListComponent } from '../components/tx';
import { MapComponent, NavigationComponent, HeaderStatsComponent, FooterStatsComponent } from '../components/common';
import { BlockDetailsComponent, BlockListComponent } from '../components/block';
import { NodeCardComponent, NodeDetailsComponent, NodeListComponent, ConsensusNodesListComponent } from '../components/nodes';

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
    SignalRService, NodesSignalRService, BlocksSignalRService,
    TransCountSignalRService, TransAvgCountSignalRService, FailP2PSignalRService,
    NodeRpcService, NodeService, BlockService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
