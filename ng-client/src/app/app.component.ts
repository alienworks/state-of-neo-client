import { Component, OnDestroy } from '@angular/core';
import { NodeService } from 'src/core/services/data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnDestroy {
  intervalSeconds = 10000;
  iterations = 0;
  interval: number;

  constructor(private nodeService: NodeService) {
    this.nodeService.stopUpdatingAll();
    this.nodeService.updateNodesData();

    this.interval = window.setInterval(() => {
      this.iterations++;

      if (this.nodeService.updateAll) {
        this.nodeService.updateNodesData();
      } else if (this.iterations % 3 === 0) {
        this.nodeService.updateNodesData();
        this.iterations = 0;
      }

      if (this.nodeService.getAllMemPool){
        this.nodeService.updateAllNodesMempool();
      }
      
      // this.nodeService.updateNodesData();
    }, this.intervalSeconds);
  }

  ngOnDestroy(): void {
    window.clearInterval(this.interval);
  }
}
