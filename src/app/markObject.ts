export enum MarkType {
  CIRCLE,
  TRIANGLE,
  EMPTY
}

export enum SimulationStatus {
  STOPPED,
  RUNNING
}

export class MarkObject {
  public indexX: number;
  public indexY: number;
  public type: MarkType;

  constructor(indexX: number, indexY: number, type: MarkType) {
    this.indexX = indexX;
    this.indexY = indexY;
    this.type = type;
  }
}
