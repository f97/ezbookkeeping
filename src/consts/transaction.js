const allTransactionTypes = {
    ModifyBalance: 1,
    Income: 2,
    Expense: 3,
    Transfer: 4
};

const allTransactionEditScopeTypes = {
    None: {
        type: 0,
        name: 'None'
    },
    All: {
        type: 1,
        name: 'All'
    },
    TodayOrLater: {
        type: 2,
        name: 'Today or later'
    },
    Recent24HoursOrLater: {
        type: 3,
        name: 'Recent 24 hours or later'
    },
    ThisWeekOrLater: {
        type: 4,
        name: 'This week or later'
    },
    ThisMonthOrLater: {
        type: 5,
        name: 'This month or later'
    },
    ThisYearOrLater: {
        type: 6,
        name: 'This year or later'
    }
};

const allTransactionTagFilterTypes = {
    HasAny: {
        type: 0,
        name: 'With Any Selected Tags'
    },
    HasAll: {
        type: 1,
        name: 'With All Selected Tags'
    },
    NotHasAny: {
        type: 2,
        name: 'Without Any Selected Tags'
    },
    NotHasAll: {
        type: 3,
        name: 'Without All Selected Tags'
    }
};

const defaultTransactionTagFilterType = allTransactionTagFilterTypes.HasAny;

const minAmountNumber = -99999999999; // -999999999.99
const maxAmountNumber = 99999999999; //  999999999.99
const maxPictureCount = 10;

export default {
    allTransactionTypes: allTransactionTypes,
    allTransactionEditScopeTypes: allTransactionEditScopeTypes,
    allTransactionTagFilterTypes: allTransactionTagFilterTypes,
    defaultTransactionTagFilterType: defaultTransactionTagFilterType,
    minAmountNumber: minAmountNumber,
    maxAmountNumber: maxAmountNumber,
    maxPictureCount: maxPictureCount,
};
