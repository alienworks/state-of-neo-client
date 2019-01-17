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
    unitOfTime = UnitOfTime.Hour;
}

export enum UnitOfTime {
    Second,
    Hour,
    Day,
    Month,
    None = 99
}
