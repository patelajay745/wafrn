import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss'],
})
export class BlocksComponent {
  userBlocks: any[] = [];
  serverBlocks: any[] = [];
  ready = false;
  constructor(private adminService: AdminService) {
    adminService.getBlocks().then((response) => {
      this.userBlocks = response.userBlocks.map((elem: any) => {
        return elem;
      });
      this.serverBlocks = response.userServerBlocks.map((elem: any) => {
        return elem;
      });
      this.ready = true;
    });
  }
}
