import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, OnChanges } from '@angular/core';
import { Condition } from '../models/condition.model';
import { EventLogStatistics } from 'src/app/log/models/eventlog-statistics.model';

@Component({
  selector: 'app-condition-list',
  template: `
              <div class="condition-query-list">
                <div class="condition-query-item" *ngFor="let condition of conditions">
                  <app-condition-single
                    [condition]="condition"
                    [context]="context"
                    (delete)="onDelete(condition)">
                  </app-condition-single>
                </div>
              </div>
            `,
  styleUrls: ['./condition-list.component.scss']
})
export class ConditionListComponent implements OnInit {
  @Input() conditions: Condition[];
  @Input() context: EventLogStatistics;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
  }

  onDelete(condition: Condition) {
    setTimeout(x => this.conditions.splice(this.conditions.indexOf(condition), 1), 1);
  }
}
