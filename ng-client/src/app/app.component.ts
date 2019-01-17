import { Component } from '@angular/core';
import { NodeService } from 'src/core/services/data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  intervalSeconds = 5000;
  iterations = 0;

  constructor(private nodeService: NodeService) {
    this.nodeService.stopUpdatingAll();
    this.nodeService.updateNodesData();

    window.setInterval(() => {
      this.iterations++;

      if (this.nodeService.updateAll) {
        this.nodeService.updateNodesData();
      } else if (this.iterations % 5 === 0) {
        this.nodeService.updateNodesData();
        this.iterations = 0;
      }
      // this.nodeService.updateNodesData();
    }, this.intervalSeconds);
  }
}
