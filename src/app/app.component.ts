import { Component } from '@angular/core';
import { MarkObject, MarkType, SimulationStatus } from './markObject';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [NgFor, NgIf]
})
export class AppComponent {
  title = 'Olympiada';
  markTypes = MarkType;
  simulationStatuses = SimulationStatus;

  objects : Array<Array<MarkObject>>;
  width = 6;

  height = 6;
  defaultMarkCount = 3;
  currentMarkType: MarkType = MarkType.CIRCLE;

  currentMarkCount = [this.defaultMarkCount, this.defaultMarkCount, this.width * this.height];
  simulationStatus: SimulationStatus = SimulationStatus.STOPPED;
  currentStep = 0;

  constructor() {
    this.objects = [];
    this.initEmpty();
  }

  private initEmpty() {
    for (let i = 0; i < this.height; i++) {
      const row = [];
      for (let j = 0; j < this.width; j++) {
        row.push(new MarkObject(i, j, MarkType.EMPTY));
      }
      this.objects.push(row);
    }
  };

  addMark(mark: MarkObject) {
    // @ts-ignore
    if (this.currentMarkType !== MarkType.EMPTY && this.currentMarkCount.at(this.currentMarkType) === 0){
      return;
    }

    this.currentMarkCount[this.currentMarkType] = this.currentMarkCount[this.currentMarkType] - 1;
    this.currentMarkCount[mark.type] = this.currentMarkCount[mark.type] + 1;
    mark.type = this.currentMarkType;
  }

  changeMarkType(markType: MarkType) {
    this.currentMarkType = markType;
  }

  startSimulation() {
    this.simulationStatus = SimulationStatus.RUNNING;
    this.recursiveSimulateStep();
  }

  stopSimulation() {
    this.simulationStatus = SimulationStatus.STOPPED;
  }

  private recursiveSimulateStep() {
    let changeCheck = false;
    if (this.simulationStatus === SimulationStatus.STOPPED) {
      return;
    }
    const newArray: Array<Array<MarkObject>> = [];
    for (let i = 0; i < this.height; i++) {
      const row = [];
      for (let j = 0; j < this.width; j++) {
        const oldObject = this.objects[i][j];
        const upper = this.objects[i - 1]?.at(j);
        const lower = this.objects[i + 1]?.at(j);
        const left = this.objects[i]?.at(j - 1);
        const right = this.objects[i]?.at(j + 1);
        let circlesCount = 0;
        let trianglesCount = 0;
        [upper, lower, left, right].forEach(x => {
          if (x?.type === MarkType.CIRCLE) {
            circlesCount++;
            return;
          }
          if (x?.type === MarkType.TRIANGLE) {
            trianglesCount++;
            return;
          }
        });
        if (oldObject?.type === MarkType.EMPTY) {
          row.push(new MarkObject(j, i, MarkType.EMPTY));
          continue;
        }
        if (circlesCount === trianglesCount) {
          row.push(new MarkObject(j, i, oldObject.type));
          continue;
        }
        if ((circlesCount > trianglesCount ? MarkType.CIRCLE : MarkType.TRIANGLE) !== oldObject.type) {
          changeCheck = true;
        }
        row.push(new MarkObject(j, i, circlesCount > trianglesCount ? MarkType.CIRCLE : MarkType.TRIANGLE));
      }
      newArray.push(row);
    }
    this.objects = newArray;
    console.log(this.currentStep, this.simulationStatus);
    if (changeCheck) {
      this.currentStep++;
      setTimeout(() => this.recursiveSimulateStep(), 1500);
    } else {
      this.simulationStatus = SimulationStatus.STOPPED;
    }
  }

  reset() {
    this.simulationStatus === SimulationStatus.STOPPED;
    this.currentStep = 0;
    this.objects = [];
    this.initEmpty();
    this.currentMarkType = MarkType.CIRCLE;
    this.currentMarkCount = [this.defaultMarkCount, this.defaultMarkCount, this.width * this.height];
  }
}
