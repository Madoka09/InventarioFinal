import { NgModule } from '@angular/core';
import { ExpandableComponent } from './expandable/expandable';
import { GlobalComponent } from './global/global';
@NgModule({
	declarations: [ExpandableComponent,
    GlobalComponent,
    GlobalComponent],
	imports: [],
	exports: [ExpandableComponent,
    GlobalComponent,
    GlobalComponent]
})
export class ComponentsModule {}
