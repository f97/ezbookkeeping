import type {
    ColorValue,
    ColorStyleValue,
    ColorInfo
} from '@/core/color.ts';

import {
    DEFAULT_ICON_COLOR,
    DEFAULT_ACCOUNT_COLOR,
    DEFAULT_CATEGORY_COLOR,
    DEFAULT_COLOR_STYLE_VARIABLE
} from '@/consts/color.ts';

export function getColorsInRows(allColorValues: ColorValue[], itemPerRow: number): ColorInfo[][] {
    const ret: ColorInfo[][] = [];
    let rowCount = -1;

    for (let i = 0; i < allColorValues.length; i++) {
        if (i % itemPerRow === 0) {
            ret[++rowCount] = [];
        }

        ret[rowCount]!.push({
            color: allColorValues[i] as ColorValue
        });
    }

    return ret;
}

export function getDisplayColor(color?: ColorValue, defaultColor: ColorValue = DEFAULT_ICON_COLOR): ColorStyleValue {
    if (color && color !== defaultColor) {
        return `#${color}`;
    } else {
        return DEFAULT_COLOR_STYLE_VARIABLE;
    }
}

export function getCategoryDisplayColor(color?: ColorValue): ColorStyleValue {
    return getDisplayColor(color, DEFAULT_CATEGORY_COLOR);
}

export function getAccountDisplayColor(color?: ColorValue): ColorStyleValue {
    return getDisplayColor(color, DEFAULT_ACCOUNT_COLOR);
}
