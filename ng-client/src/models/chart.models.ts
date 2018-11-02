export class ChartDataItemModel {
    startDate: Date;
    unitOfTime: UnitOfTime;
    value: number;
}

export class ChartFilterModel {
    startDate: Date;
    endDate: Date;
    unitOfTime: UnitOfTime;
}

export enum UnitOfTime {
    Hour,
    Day,
    Month
}
