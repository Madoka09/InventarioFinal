import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddproviderPage } from './add-provider';

@NgModule({
  declarations: [
    AddproviderPage,
  ],
  imports: [
    IonicPageModule.forChild(AddproviderPage),
  ],
})
export class AddproviderPageModule {}
