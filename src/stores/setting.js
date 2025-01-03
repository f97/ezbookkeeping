import { defineStore } from 'pinia';

import { WeekDay } from '@/core/datetime.ts';
import { DEFAULT_CURRENCY_CODE } from '@/consts/currency.ts';
import * as settings from '@/lib/settings.js';

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        appSettings: {
            theme: settings.getTheme(),
            fontSize: settings.getFontSize(),
            timeZone: settings.getTimeZone(),
            applicationLock: settings.isEnableApplicationLock(),
            applicationLockWebAuthn: settings.isEnableApplicationLockWebAuthn(),
            autoUpdateExchangeRatesData: settings.isAutoUpdateExchangeRatesData(),
            autoSaveTransactionDraft: settings.getAutoSaveTransactionDraft(),
            autoGetCurrentGeoLocation: settings.isAutoGetCurrentGeoLocation(),
            showAmountInHomePage: settings.isShowAmountInHomePage(),
            timezoneUsedForStatisticsInHomePage: settings.getTimezoneUsedForStatisticsInHomePage(),
            itemsCountInTransactionListPage: settings.getItemsCountInTransactionListPage(),
            showTotalAmountInTransactionListPage: settings.isShowTotalAmountInTransactionListPage(),
            showTagInTransactionListPage: settings.isShowTagInTransactionListPage(),
            showAccountBalance: settings.isShowAccountBalance(),
            currencySortByInExchangeRatesPage: settings.getCurrencySortByInExchangeRatesPage(),
            statistics: {
                defaultChartDataType: settings.getStatisticsDefaultChartDataType(),
                defaultTimezoneType: settings.getStatisticsDefaultTimezoneType(),
                defaultAccountFilter: settings.getStatisticsDefaultAccountFilter(),
                defaultTransactionCategoryFilter: settings.getStatisticsDefaultTransactionCategoryFilter(),
                defaultSortingType: settings.getStatisticsSortingType(),
                defaultCategoricalChartType: settings.getStatisticsDefaultCategoricalChartType(),
                defaultCategoricalChartDataRangeType: settings.getStatisticsDefaultCategoricalChartDataRange(),
                defaultTrendChartType: settings.getStatisticsDefaultTrendChartType(),
                defaultTrendChartDataRangeType: settings.getStatisticsDefaultTrendChartDataRange(),
            },
            animate: settings.isEnableAnimate()
        },
        localeDefaultSettings: {
            currency: DEFAULT_CURRENCY_CODE,
            firstDayOfWeek: WeekDay.DefaultFirstDay.type
        }
    }),
    actions: {
        setTheme(value) {
            settings.setTheme(value);
            this.appSettings.theme = value;
        },
        setFontSize(value) {
            settings.setFontSize(value);
            this.appSettings.fontSize = value;
        },
        setTimeZone(value) {
            settings.setTimeZone(value);
            this.appSettings.timeZone = value;
        },
        setEnableApplicationLock(value) {
            settings.setEnableApplicationLock(value);
            this.appSettings.applicationLock = value;
        },
        setEnableApplicationLockWebAuthn(value) {
            settings.setEnableApplicationLockWebAuthn(value);
            this.appSettings.applicationLockWebAuthn = value;
        },
        setAutoUpdateExchangeRatesData(value) {
            settings.setAutoUpdateExchangeRatesData(value);
            this.appSettings.autoUpdateExchangeRatesData = value;
        },
        setAutoSaveTransactionDraft(value) {
            settings.setAutoSaveTransactionDraft(value);
            this.appSettings.autoSaveTransactionDraft = value;
        },
        setAutoGetCurrentGeoLocation(value) {
            settings.setAutoGetCurrentGeoLocation(value);
            this.appSettings.autoGetCurrentGeoLocation = value;
        },
        setShowAmountInHomePage(value) {
            settings.setShowAmountInHomePage(value);
            this.appSettings.showAmountInHomePage = value;
        },
        setTimezoneUsedForStatisticsInHomePage(value) {
            settings.setTimezoneUsedForStatisticsInHomePage(value);
            this.appSettings.timezoneUsedForStatisticsInHomePage = value;
        },
        setItemsCountInTransactionListPage(value) {
            settings.setItemsCountInTransactionListPage(value);
            this.appSettings.itemsCountInTransactionListPage = value;
        },
        setShowTotalAmountInTransactionListPage(value) {
            settings.setShowTotalAmountInTransactionListPage(value);
            this.appSettings.showTotalAmountInTransactionListPage = value;
        },
        setShowTagInTransactionListPage(value) {
            settings.setShowTagInTransactionListPage(value);
            this.appSettings.showTagInTransactionListPage = value;
        },
        setShowAccountBalance(value) {
            settings.setShowAccountBalance(value);
            this.appSettings.showAccountBalance = value;
        },
        setCurrencySortByInExchangeRatesPage(value) {
            settings.setCurrencySortByInExchangeRatesPage(value);
            this.appSettings.currencySortByInExchangeRatesPage = value;
        },
        setStatisticsDefaultChartDataType(value) {
            settings.setStatisticsDefaultChartDataType(value);
            this.appSettings.statistics.defaultChartDataType = value;
        },
        setStatisticsDefaultTimezoneType(value) {
            settings.setStatisticsDefaultTimezoneType(value);
            this.appSettings.statistics.defaultTimezoneType = value;
        },
        setStatisticsDefaultAccountFilter(value) {
            settings.setStatisticsDefaultAccountFilter(value);
            this.appSettings.statistics.defaultAccountFilter = value;
        },
        setStatisticsDefaultTransactionCategoryFilter(value) {
            settings.setStatisticsDefaultTransactionCategoryFilter(value);
            this.appSettings.statistics.defaultTransactionCategoryFilter = value;
        },
        setStatisticsSortingType(value) {
            settings.setStatisticsSortingType(value);
            this.appSettings.statistics.defaultSortingType = value;
        },
        setStatisticsDefaultCategoricalChartType(value) {
            settings.setStatisticsDefaultCategoricalChartType(value);
            this.appSettings.statistics.defaultCategoricalChartType = value;
        },
        setStatisticsDefaultCategoricalChartDateRange(value) {
            settings.setStatisticsDefaultCategoricalChartDataRange(value);
            this.appSettings.statistics.defaultCategoricalChartDataRangeType = value;
        },
        setStatisticsDefaultTrendChartType(value) {
            settings.setStatisticsDefaultTrendChartType(value);
            this.appSettings.statistics.defaultTrendChartType = value;
        },
        setStatisticsDefaultTrendChartDateRange(value) {
            settings.setStatisticsDefaultTrendChartDataRange(value);
            this.appSettings.statistics.defaultTrendChartDataRangeType = value;
        },
        setEnableAnimate(value) {
            settings.setEnableAnimate(value);
            this.appSettings.animate = value;
        },
        clearAppSettings() {
            settings.clearSettings();
        },
        updateLocalizedDefaultSettings(localeDefaultSettings) {
            if (!localeDefaultSettings) {
                return;
            }

            this.localeDefaultSettings.currency = localeDefaultSettings.defaultCurrency;
            this.localeDefaultSettings.firstDayOfWeek = localeDefaultSettings.defaultFirstDayOfWeek;
        }
    }
});
