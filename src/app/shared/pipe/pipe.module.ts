import { NgModule } from '@angular/core';
import { HourPipe } from './hour.pipe';
import { TimeAgo } from './time-ago.pipe';

@NgModule({
declarations: [HourPipe,TimeAgo],
imports: [],
exports: [HourPipe,TimeAgo],
})

export class PipeModule {}