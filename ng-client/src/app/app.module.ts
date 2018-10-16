import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from "@angular/http";
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from 'src/components/home.component';
import { IconComponent } from './icon.component';
import { HeaderComponent } from './../components/common/header.component';
import { HeaderStatsComponent } from 'src/components/common/header-stats.component';
import { FooterStatsComponent } from 'src/components/common/footer-stats.component';
import { NodeCardComponent } from 'src/components/nodes/node-card.component';

import { SignalRService } from 'src/core/services/signal-r.service';
import { NodesSignalRService } from 'src/core/services/nodes-signal-r.service';
import { BlocksSignalRService } from 'src/core/services/blocks-signal-r.service';
import { NodeRpcService } from 'src/core/services/node-rpc.service';
import { TransCountSignalRService } from 'src/core/services/trans-count-signal-r.service';
import { TransAvgCountSignalRService } from 'src/core/services/trans-avg-count-signal-r.service';
import { FailP2PSignalRService } from 'src/core/services/fail-p2p-signal-r.service';
import { NodeService } from 'src/core/services/node.service';
import { BlockService } from 'src/core/services/block.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    IconComponent,
    HeaderComponent,
    HeaderStatsComponent,
    FooterStatsComponent,
    NodeCardComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
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
