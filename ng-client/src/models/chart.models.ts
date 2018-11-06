export class ChartDataItemModel {
    startDate: Date;
    label: string;
    unitOfTime: UnitOfTime;
    value: number;
}

export class ChartFilterModel {
    startDate: Date;
    endDate: Date;
    endPeriod: number;
    unitOfTime = UnitOfTime.Day;
}

export enum UnitOfTime {
    Hour,
    Day,
    Month
}
