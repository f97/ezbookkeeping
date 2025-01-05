import type { TypeAndName } from '@/core/base.ts';

export interface NumberFormatOptions {
    digitGrouping?: number;
    digitGroupingSymbol?: string;
    decimalNumberCount?: number;
    decimalSeparator?: string;
    trimTailZero?: boolean;
}

export class DecimalSeparator implements TypeAndName {
    private static readonly allInstances: DecimalSeparator[] = [];
    private static readonly allInstancesByType: Record<number, DecimalSeparator> = {};
    private static readonly allInstancesByTypeName: Record<string, DecimalSeparator> = {};

    public static readonly LanguageDefaultType: number = 0;
    public static readonly Dot = new DecimalSeparator(1, 'Dot', '.');
    public static readonly Comma = new DecimalSeparator(2, 'Comma', ',');
    public static readonly Space = new DecimalSeparator(3, 'Space', ' ');

    public static readonly Default = DecimalSeparator.Dot;

    public readonly type: number;
    public readonly name: string;
    public readonly symbol: string;

    private constructor(type: number, name: string, symbol: string) {
        this.type = type;
        this.name = name;
        this.symbol = symbol;

        DecimalSeparator.allInstances.push(this);
        DecimalSeparator.allInstancesByType[type] = this;
        DecimalSeparator.allInstancesByTypeName[name] = this;
    }

    public static values(): DecimalSeparator[] {
        return DecimalSeparator.allInstances;
    }

    public static valueOf(type: number): DecimalSeparator {
        return DecimalSeparator.allInstancesByType[type];
    }

    public static parse(typeName: string): DecimalSeparator {
        return DecimalSeparator.allInstancesByTypeName[typeName];
    }
}

export class DigitGroupingSymbol implements TypeAndName {
    private static readonly allInstances: DigitGroupingSymbol[] = [];
    private static readonly allInstancesByType: Record<number, DigitGroupingSymbol> = {};
    private static readonly allInstancesByTypeName: Record<string, DigitGroupingSymbol> = {};

    public static readonly LanguageDefaultType: number = 0;
    public static readonly Dot = new DigitGroupingSymbol(1, 'Dot', '.');
    public static readonly Comma = new DigitGroupingSymbol(2, 'Comma', ',');
    public static readonly Space = new DigitGroupingSymbol(3, 'Space', ' ');
    public static readonly Apostrophe = new DigitGroupingSymbol(4, 'Apostrophe', '\'');

    public static readonly Default = DigitGroupingSymbol.Comma;

    public readonly type: number;
    public readonly name: string;
    public readonly symbol: string;

    private constructor(type: number, name: string, symbol: string) {
        this.type = type;
        this.name = name;
        this.symbol = symbol;

        DigitGroupingSymbol.allInstances.push(this);
        DigitGroupingSymbol.allInstancesByType[type] = this;
        DigitGroupingSymbol.allInstancesByTypeName[name] = this;
    }

    public static values(): DigitGroupingSymbol[] {
        return DigitGroupingSymbol.allInstances;
    }

    public static valueOf(type: number): DigitGroupingSymbol {
        return DigitGroupingSymbol.allInstancesByType[type];
    }

    public static parse(typeName: string): DigitGroupingSymbol {
        return DigitGroupingSymbol.allInstancesByTypeName[typeName];
    }
}

export class DigitGroupingType implements TypeAndName {
    private static readonly allInstances: DigitGroupingType[] = [];
    private static readonly allInstancesByType: Record<number, DigitGroupingType> = {};
    private static readonly allInstancesByTypeName: Record<string, DigitGroupingType> = {};

    public static readonly LanguageDefaultType: number = 0;
    public static readonly None = new DigitGroupingType(1, 'None', 'None', false);
    public static readonly ThousandsSeparator = new DigitGroupingType(2, 'ThousandsSeparator', 'Thousands Separator', true);

    public static readonly Default = DigitGroupingType.ThousandsSeparator;

    public readonly type: number;
    public readonly typeName: string;
    public readonly name: string;
    public readonly enabled: boolean;

    private constructor(type: number, typeName: string, name: string, enabled: boolean) {
        this.type = type;
        this.typeName = typeName;
        this.name = name;
        this.enabled = enabled;

        DigitGroupingType.allInstances.push(this);
        DigitGroupingType.allInstancesByType[type] = this;
        DigitGroupingType.allInstancesByTypeName[typeName] = this;
    }

    public static values(): DigitGroupingType[] {
        return DigitGroupingType.allInstances;
    }

    public static valueOf(type: number): DigitGroupingType {
        return DigitGroupingType.allInstancesByType[type];
    }

    public static parse(typeName: string): DigitGroupingType {
        return DigitGroupingType.allInstancesByTypeName[typeName];
    }
}

export class AmountFilterType {
    private static readonly allInstances: AmountFilterType[] = [];
    private static readonly allInstancesByType: Record<string, AmountFilterType> = {};

    public static readonly GreaterThan = new AmountFilterType('gt', 'Greater than', 1);
    public static readonly LessThan = new AmountFilterType('lt', 'Less than', 1);
    public static readonly EqualTo = new AmountFilterType('eq', 'Equal to', 1);
    public static readonly NotEqualTo = new AmountFilterType('ne', 'Not equal to', 1);
    public static readonly Between = new AmountFilterType('bt', 'Between', 2);
    public static readonly NotBetween = new AmountFilterType('nb', 'Not between', 2);

    public readonly type: string;
    public readonly name: string;
    public readonly paramCount: number;

    private constructor(type: string, name: string, paramCount: number) {
        this.type = type;
        this.name = name;
        this.paramCount = paramCount;

        AmountFilterType.allInstances.push(this);
        AmountFilterType.allInstancesByType[type] = this;
    }

    public static values(): AmountFilterType[] {
        return AmountFilterType.allInstances;
    }

    public static valueOf(type: string): AmountFilterType {
        return AmountFilterType.allInstancesByType[type];
    }
}
