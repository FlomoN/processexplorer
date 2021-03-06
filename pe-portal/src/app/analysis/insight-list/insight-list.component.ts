import { Component, Input, OnChanges } from '@angular/core';

import HumanizeDuration from 'humanize-duration';
import { QueryConvertService } from 'src/app/analysis/shared/query-convert.service';
import { AnalysisService } from 'src/app/analysis/shared/analysis.service';
import { Insight } from '../models/insight.model';
import { Condition } from '../models/condition.model';
import { EventLogStatistics } from 'src/app/log/models/eventlog-statistics.model';

@Component({
  selector: 'app-insight-list',
  templateUrl: './insight-list.component.html',
  styleUrls: ['./insight-list.component.scss']
})
export class InsightListComponent implements OnChanges {
  @Input() public context: EventLogStatistics;
  @Input() public logName: string;
  @Input() public conditions: Condition[];

  public insights: Insight[] = [];

  constructor(
    private analysisService: AnalysisService,
    private queryConvertService: QueryConvertService
  ) { }

  ngOnChanges() {
    this.update();
  }

  update() {
    if (!this.conditions || this.conditions.length === 0 || !this.context) {
      return;
    }

    this.insights = undefined;

    this.analysisService.getInsights(this.logName, this.queryConvertService.convertToQuery(this.conditions))
      .subscribe(insights => {
        this.insights = insights.filter(x => x.casesWithin / this.context.numTraces > 0.25 || x.casesWithin === 0);
        this.insights = this.insights.sort(this.sortByEffectSize);
      });
  }

  sortByEffectSize(a: Insight, b: Insight) {
    if (Math.abs(a.effectSize) < Math.abs(b.effectSize)) {
      return 1;
    }
    if (Math.abs(a.effectSize) > Math.abs(b.effectSize)) {
      return -1;
    }
    return 0;
  }

  humanizeDuration(duration: number) {
    return HumanizeDuration(duration * 1000, { largest: 1, round: true });
  }
}
