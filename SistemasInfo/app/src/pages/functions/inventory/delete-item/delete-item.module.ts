import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeleteitemPage } from './delete-item';

@NgModule({
  declarations: [
    DeleteitemPage,
  ],
  imports: [
    IonicPageModule.forChild(DeleteitemPage),
  ],
})
export class DeleteitemPageModule {}
