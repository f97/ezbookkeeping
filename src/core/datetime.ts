import type { TypeAndName } from '@/core/base.ts';

export class Month {
    private static readonly allInstances: Month[] = [];

    public static readonly January = new Month(1, 'January');
    public static readonly February = new Month(2, 'February');
    public static readonly March = new Month(3, 'March');
    public static readonly April = new Month(4, 'April');
    public static readonly May = new Month(5, 'May');
    public static readonly June = new Month(6, 'June');
    public static readonly July = new Month(7, 'July');
    public static readonly August = new Month(8, 'August');
    public static readonly September = new Month(9, 'September');
    public static readonly October = new Month(10, 'October');
    public static readonly November = new Month(11, 'November');
    public static readonly December = new Month(12, 'December');

    public readonly month: number;
    public readonly name: string;

    private constructor(month: number, name: string) {
        this.month = month;
        this.name = name;

        Month.allInstances.push(this);
    }

    public static values(): Month[] {
        return Month.allInstances;
    }

    public static valueOf(month: number): Month {
        return Month.allInstances[month - 1];
    }
}

export class WeekDay implements TypeAndName {
    private static readonly allInstances: WeekDay[] = [];
    private static readonly allInstancesByName: Record<string, WeekDay> = {};

    public static readonly Sunday = new WeekDay(0, 'Sunday');
    public static readonly Monday = new WeekDay(1, 'Monday');
    public static readonly Tuesday = new WeekDay(2, 'Tuesday');
    public static readonly Wednesday = new WeekDay(3, 'Wednesday');
    public static readonly Thursday = new WeekDay(4, 'Thursday');
    public static readonly Friday = new WeekDay(5, 'Friday');
    public static readonly Saturday = new WeekDay(6, 'Saturday');

    public static readonly DefaultFirstDay = WeekDay.Sunday;

    public readonly type: number;
    public readonly name: string;

    private constructor(type: number, name: string) {
        this.type = type;
        this.name = name;

        WeekDay.allInstances.push(this);
        WeekDay.allInstancesByName[name] = this;
    }

    public static values(): WeekDay[] {
        return WeekDay.allInstances;
    }

    public static valueOf(dayOfWeek: number): WeekDay {
        return WeekDay.allInstances[dayOfWeek];
    }

    public static parse(typeName: string): WeekDay {
        return WeekDay.allInstancesByName[typeName];
    }
}

export class MeridiemIndicator {
    private static readonly allInstances: MeridiemIndicator[] = [];

    public static readonly AM = new MeridiemIndicator(0, 'AM');
    public static readonly PM = new MeridiemIndicator(1, 'PM');

    public readonly type: number;
    public readonly name: string;

    private constructor(type: number, name: string) {
        this.type = type;
        this.name = name;

        MeridiemIndicator.allInstances.push(this);
    }

    public static values(): MeridiemIndicator[] {
        return MeridiemIndicator.allInstances;
    }
}

export const LANGUAGE_DEFAULT_DATE_TIME_FORMAT_VALUE: number = 0;

export interface DateFormat {
    readonly type: number;
    readonly key: string;
    readonly isMonthAfterYear: boolean;
}

type DateFormatTypeName = 'YYYYMMDD' | 'MMDDYYYY' | 'DDMMYYYY';

export class LongDateFormat implements DateFormat {
    private static readonly allInstances: LongDateFormat[] = [];
    private static readonly allInstancesByType: Record<number, LongDateFormat> = {};
    private static readonly allInstancesByTypeName: Record<string, LongDateFormat> = {};

    public static readonly YYYYMMDD = new LongDateFormat(1, 'YYYYMMDD', 'yyyy_mm_dd', true);
    public static readonly MMDDYYYY = new LongDateFormat(2, 'MMDDYYYY', 'mm_dd_yyyy', false);
    public static readonly DDMMYYYY = new LongDateFormat(3, 'DDMMYYYY', 'dd_mm_yyyy', false);

    public static readonly Default = LongDateFormat.YYYYMMDD;

    public readonly type: number;
    public readonly typeName: string;
    public readonly key: string;
    public readonly isMonthAfterYear: boolean;

    private constructor(type: number, typeName: DateFormatTypeName, key: string, isMonthAfterYear: boolean) {
        this.type = type;
        this.typeName = typeName;
        this.key = key;
        this.isMonthAfterYear = isMonthAfterYear;

        LongDateFormat.allInstances.push(this);
        LongDateFormat.allInstancesByType[type] = this;
        LongDateFormat.allInstancesByTypeName[typeName] = this;
    }

    public static values(): LongDateFormat[] {
        return LongDateFormat.allInstances;
    }

    public static all(): Record<DateFormatTypeName, LongDateFormat> {
        return LongDateFormat.allInstancesByTypeName;
    }

    public static valueOf(type: number): LongDateFormat {
        return LongDateFormat.allInstancesByType[type];
    }
}

export class ShortDateFormat implements DateFormat {
    private static readonly allInstances: ShortDateFormat[] = [];
    private static readonly allInstancesByType: Record<number, ShortDateFormat> = {};
    private static readonly allInstancesByTypeName: Record<string, ShortDateFormat> = {};

    public static readonly YYYYMMDD = new ShortDateFormat(1, 'YYYYMMDD', 'yyyy_mm_dd', true);
    public static readonly MMDDYYYY = new ShortDateFormat(2, 'MMDDYYYY', 'mm_dd_yyyy', false);
    public static readonly DDMMYYYY = new ShortDateFormat(3, 'DDMMYYYY', 'dd_mm_yyyy', false);

    public static readonly Default = ShortDateFormat.YYYYMMDD;

    public readonly type: number;
    public readonly typeName: string;
    public readonly key: string;
    public readonly isMonthAfterYear: boolean;

    private constructor(type: number, typeName: DateFormatTypeName, key: string, isMonthAfterYear: boolean) {
        this.type = type;
        this.typeName = typeName;
        this.key = key;
        this.isMonthAfterYear = isMonthAfterYear;

        ShortDateFormat.allInstances.push(this);
        ShortDateFormat.allInstancesByType[type] = this;
        ShortDateFormat.allInstancesByTypeName[typeName] = this;
    }

    public static values(): ShortDateFormat[] {
        return ShortDateFormat.allInstances;
    }

    public static all(): Record<DateFormatTypeName, ShortDateFormat> {
        return ShortDateFormat.allInstancesByTypeName;
    }

    public static valueOf(type: number): ShortDateFormat {
        return ShortDateFormat.allInstancesByType[type];
    }
}

export interface TimeFormat {
    readonly type: number;
    readonly key: string;
    readonly is24HourFormat: boolean;
    readonly isMeridiemIndicatorFirst: boolean | null;
}

export type LongTimeFormatTypeName = 'HHMMSS' | 'AHHMMSS' | 'HHMMSSA';

export class LongTimeFormat implements TimeFormat {
    private static readonly allInstances: LongTimeFormat[] = [];
    private static readonly allInstancesByType: Record<number, LongTimeFormat> = {};
    private static readonly allInstancesByTypeName: Record<string, LongTimeFormat> = {};

    public static readonly HHMMSS = new LongTimeFormat(1, 'HHMMSS', 'hh_mm_ss', true, null);
    public static readonly AHHMMSS = new LongTimeFormat(2, 'AHHMMSS', 'a_hh_mm_ss', false, true);
    public static readonly HHMMSSA = new LongTimeFormat(3, 'HHMMSSA', 'hh_mm_ss_a', false, false);

    public static readonly Default = LongTimeFormat.HHMMSS;

    public readonly type: number;
    public readonly typeName: string;
    public readonly key: string;
    public readonly is24HourFormat: boolean;
    public readonly isMeridiemIndicatorFirst: boolean | null;

    private constructor(type: number, typeName: LongTimeFormatTypeName, key: string, is24HourFormat: boolean, isMeridiemIndicatorFirst: boolean | null) {
        this.type = type;
        this.typeName = typeName;
        this.key = key;
        this.is24HourFormat = is24HourFormat;
        this.isMeridiemIndicatorFirst = isMeridiemIndicatorFirst;

        LongTimeFormat.allInstances.push(this);
        LongTimeFormat.allInstancesByType[type] = this;
        LongTimeFormat.allInstancesByTypeName[typeName] = this;
    }

    public static values(): LongTimeFormat[] {
        return LongTimeFormat.allInstances;
    }

    public static all(): Record<LongTimeFormatTypeName, LongTimeFormat> {
        return LongTimeFormat.allInstancesByTypeName;
    }

    public static valueOf(type: number): LongTimeFormat {
        return LongTimeFormat.allInstancesByType[type];
    }
}

export type ShortTimeFormatTypeName = 'HHMM' | 'AHHMM' | 'HHMMA';

export class ShortTimeFormat implements TimeFormat {
    private static readonly allInstances: ShortTimeFormat[] = [];
    private static readonly allInstancesByType: Record<number, ShortTimeFormat> = {};
    private static readonly allInstancesByTypeName: Record<string, ShortTimeFormat> = {};

    public static readonly HHMM = new ShortTimeFormat(1, 'HHMM', 'hh_mm', true, null);
    public static readonly AHHMM = new ShortTimeFormat(2, 'AHHMM', 'a_hh_mm', false, true);
    public static readonly HHMMA = new ShortTimeFormat(3, 'HHMMA', 'hh_mm_a', false, false);

    public static readonly Default = ShortTimeFormat.HHMM;

    public readonly type: number;
    public readonly typeName: string;
    public readonly key: string;
    public readonly is24HourFormat: boolean;
    public readonly isMeridiemIndicatorFirst: boolean | null;

    private constructor(type: number, typeName: ShortTimeFormatTypeName, key: string, is24HourFormat: boolean, isMeridiemIndicatorFirst: boolean | null) {
        this.type = type;
        this.typeName = typeName;
        this.key = key;
        this.is24HourFormat = is24HourFormat;
        this.isMeridiemIndicatorFirst = isMeridiemIndicatorFirst;

        ShortTimeFormat.allInstances.push(this);
        ShortTimeFormat.allInstancesByType[type] = this;
        ShortTimeFormat.allInstancesByTypeName[typeName] = this;
    }

    public static values(): ShortTimeFormat[] {
        return ShortTimeFormat.allInstances;
    }

    public static all(): Record<ShortTimeFormatTypeName, ShortTimeFormat> {
        return ShortTimeFormat.allInstancesByTypeName;
    }

    public static valueOf(type: number): ShortTimeFormat {
        return ShortTimeFormat.allInstancesByType[type];
    }
}

export enum DateRangeScene {
    Normal = 0,
    TrendAnalysis = 1
}

export type DateRangeTypeName = 'All' |
    'Today' | 'Yesterday' |
    'LastSevenDays' | 'LastThirtyDays' |
    'ThisWeek' | 'LastWeek' |
    'ThisMonth' | 'LastMonth' |
    'ThisYear' | 'LastYear' |
    'PreviousBillingCycle' | 'CurrentBillingCycle' |
    'RecentTwelveMonths' | 'RecentTwentyFourMonths' | 'RecentThirtySixMonths' |
    'RecentTwoYears' | 'RecentThreeYears' | 'RecentFiveYears' |
    'Custom';

export class DateRange implements TypeAndName {
    private static readonly allInstances: DateRange[] = [];
    private static readonly allInstancesByType: Record<number, DateRange> = {};
    private static readonly allInstancesByTypeName: Record<string, DateRange> = {};

    // All date range
    public static readonly All = new DateRange(0, 'All', 'All', false, DateRangeScene.Normal, DateRangeScene.TrendAnalysis);

    // Date ranges for normal scene only
    public static readonly Today = new DateRange(1, 'Today', 'Today', false, DateRangeScene.Normal);
    public static readonly Yesterday = new DateRange(2, 'Yesterday', 'Yesterday', false, DateRangeScene.Normal);
    public static readonly LastSevenDays = new DateRange(3, 'LastSevenDays', 'Recent 7 days', false, DateRangeScene.Normal);
    public static readonly LastThirtyDays = new DateRange(4, 'LastThirtyDays', 'Recent 30 days', false, DateRangeScene.Normal);
    public static readonly ThisWeek = new DateRange(5, 'ThisWeek', 'This week', false, DateRangeScene.Normal);
    public static readonly LastWeek = new DateRange(6, 'LastWeek', 'Last week', false, DateRangeScene.Normal);
    public static readonly ThisMonth = new DateRange(7, 'ThisMonth', 'This month', false, DateRangeScene.Normal);
    public static readonly LastMonth = new DateRange(8, 'LastMonth', 'Last month', false, DateRangeScene.Normal);

    // Date ranges for normal and trend analysis scene
    public static readonly ThisYear = new DateRange(9, 'ThisYear', 'This year', false, DateRangeScene.Normal, DateRangeScene.TrendAnalysis);
    public static readonly LastYear = new DateRange(10, 'LastYear', 'Last year', false, DateRangeScene.Normal, DateRangeScene.TrendAnalysis);

    // Billing cycle date ranges for normal scene only
    public static readonly PreviousBillingCycle = new DateRange(51, 'PreviousBillingCycle', 'Previous Billing Cycle', true, DateRangeScene.Normal);
    public static readonly CurrentBillingCycle = new DateRange(52, 'CurrentBillingCycle', 'Current Billing Cycle', true, DateRangeScene.Normal);

    // Date ranges for trend analysis scene only
    public static readonly RecentTwelveMonths = new DateRange(101, 'RecentTwelveMonths', 'Recent 12 months', false, DateRangeScene.TrendAnalysis);
    public static readonly RecentTwentyFourMonths = new DateRange(102, 'RecentTwentyFourMonths', 'Recent 24 months', false, DateRangeScene.TrendAnalysis);
    public static readonly RecentThirtySixMonths = new DateRange(103, 'RecentThirtySixMonths', 'Recent 36 months', false, DateRangeScene.TrendAnalysis);
    public static readonly RecentTwoYears = new DateRange(104, 'RecentTwoYears', 'Recent 2 years', false, DateRangeScene.TrendAnalysis);
    public static readonly RecentThreeYears = new DateRange(105, 'RecentThreeYears', 'Recent 3 years', false, DateRangeScene.TrendAnalysis);
    public static readonly RecentFiveYears = new DateRange(106, 'RecentFiveYears', 'Recent 5 years', false, DateRangeScene.TrendAnalysis);

    // Custom date range
    public static readonly Custom = new DateRange(255, 'Custom', 'Custom Date', false, DateRangeScene.Normal, DateRangeScene.TrendAnalysis);

    public readonly type: number;
    public readonly name: string;
    public readonly isBillingCycle: boolean;
    private readonly availableScenes: Record<number, boolean>;

    private constructor(type: number, typeName: DateRangeTypeName, name: string, isBillingCycle: boolean, ...availableScenes: DateRangeScene[]) {
        this.type = type;
        this.name = name;
        this.isBillingCycle = isBillingCycle;
        this.availableScenes = {};

        if (availableScenes) {
            for (const scene of availableScenes) {
                this.availableScenes[scene] = true;
            }
        }

        DateRange.allInstances.push(this);
        DateRange.allInstancesByType[type] = this;
        DateRange.allInstancesByTypeName[typeName] = this;
    }

    public isAvailableForScene(scene: DateRangeScene): boolean {
        return this.availableScenes[scene] || false;
    }

    public static values(): DateRange[] {
        return DateRange.allInstances;
    }

    public static all(): Record<DateRangeTypeName, DateRange> {
        return DateRange.allInstancesByTypeName;
    }

    public static valueOf(type: number): DateRange {
        return DateRange.allInstancesByType[type];
    }

    public static isAvailableForScene(type: number, scene: DateRangeScene): boolean {
        const dateRange = DateRange.allInstancesByType[type];
        return dateRange?.isAvailableForScene(scene) || false;
    }

    public static isBillingCycle(type: number): boolean {
        const dateRange = DateRange.allInstancesByType[type];
        return dateRange?.isBillingCycle || false;
    }
}