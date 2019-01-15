import { Component } from '@angular/core';
import { NodeService } from 'src/core/services/data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private nodeService: NodeService) {
    this.nodeService.stopUpdatingAll();

    window.setInterval(() => {
      this.nodeService.updateNodesData();
    }, 5000);
  }
}
