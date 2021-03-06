import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventLogStatistics } from 'src/app/log/models/eventlog-statistics.model';
import { QueryService } from 'src/app/analysis/shared/query.service';
import { ArtifactResult } from 'src/app/analysis/models/results/artifact-result.model';
import { InsightListComponent } from 'src/app/analysis/insight-list/insight-list.component';
import { QueryConvertService } from 'src/app/analysis/shared/query-convert.service';
import { Condition } from 'src/app/analysis/models/condition.model';
import { ArtifactService } from 'src/app/analysis/shared/artifact.service';
import { LogService } from 'src/app/log/shared/log.service';

@Component({
  selector: 'app-artifacts',
  templateUrl: './artifacts.component.html',
  styleUrls: ['./artifacts.component.scss']
})
export class ArtifactsComponent implements OnInit {
  @ViewChild(InsightListComponent) private insightListComponent: InsightListComponent;

  logName: string;
  context: EventLogStatistics;

  artifact: ArtifactResult;
  artifactResults: ArtifactResult[];
  artifactTotal = 0;

  conditions: Condition[];

  constructor(
    private router: Router,
    private logService: LogService,
    private queryService: QueryService,
    private artifactService: ArtifactService,
    private queryConvert: QueryConvertService
  ) { }

  ngOnInit() {
    this.logService.currentLog.subscribe(eventLog => {
      if (eventLog === null) {
        return;
      }

      this.logName = eventLog.logName;

      this.queryService.getStatistics(this.logName)
        .subscribe(statistics => this.context = statistics);

      this.runArtifacts();
    });
  }

  runArtifacts() {
    this.artifactService.getArtifactResult(this.logName)
      .subscribe(results => {
        this.artifactResults = results;
        this.artifactTotal = results.map(x => x.numAffectedCases).reduce((acc, affected) => acc + affected);
      });
  }

  onSelectArtifact(artifact: ArtifactResult) {
    this.artifact = artifact;
    this.conditions = this.queryConvert.convertFromQuery(artifact.conditions);

    this.queryService.getStatistics(this.logName, artifact.conditions).subscribe(x => {
      this.context = x;

      if (this.insightListComponent !== undefined && this.conditions !== undefined) {
        this.insightListComponent.update();
      }
    });
  }

  onShowCases(artifact: ArtifactResult) {
    this.router.navigate(['/analysis'], { state: { conditions: artifact.conditions }});
  }

  percentageFormat(percentage: number) {
    return Math.round(percentage) + '%';
  }

}
