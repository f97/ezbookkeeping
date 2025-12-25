<template>
    <f7-page @page:afterin="onPageAfterIn">
        <f7-navbar>
            <f7-nav-left :back-link="tt('Back')"></f7-nav-left>
            <f7-nav-title :title="tt(title)"></f7-nav-title>
            <f7-nav-right class="navbar-compact-icons">
                <f7-link icon-f7="ellipsis" :class="{ 'disabled': account.type !== AccountType.MultiSubAccounts.type }" @click="showMoreActionSheet = true"></f7-link>
                <f7-link icon-f7="checkmark_alt" :class="{ 'disabled': inputIsEmpty || submitting }" @click="save"></f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-list strong inset dividers class="margin-vertical skeleton-text" v-if="loading">
            <f7-list-item class="list-item-with-header-and-title" header="Account Category" title="Category"></f7-list-item>
            <f7-list-item class="list-item-with-header-and-title" header="Account Type" title="Account Type"></f7-list-item>
        </f7-list>

        <f7-list form strong inset dividers class="margin-vertical" v-else-if="!loading">
            <f7-list-item
                link="#" no-chevron
                class="list-item-with-header-and-title"
                :header="tt('Account Category')"
                :title="findDisplayNameByType(allAccountCategories, account.category)"
                @click="showAccountCategorySheet = true"
            >
                <list-item-selection-sheet value-type="item"
                                           key-field="type" value-field="type" title-field="displayName"
                                           icon-field="defaultAccountIconId" icon-type="account"
                                           :items="allAccountCategories"
                                           v-model:show="showAccountCategorySheet"
                                           v-model="account.category">
                </list-item-selection-sheet>
            </f7-list-item>

            <f7-list-item
                link="#" no-chevron
                class="list-item-with-header-and-title"
                :header="tt('Account Type')"
                :title="findDisplayNameByType(allAccountTypes, account.type)"
                @click="showAccountTypeSheet = true"
            >
                <list-item-selection-sheet value-type="item"
                                           key-field="type" value-field="type" title-field="displayName"
                                           :items="allAccountTypes"
                                           v-model:show="showAccountTypeSheet"
                                           v-model="account.type">
                </list-item-selection-sheet>
            </f7-list-item>
        </f7-list>

        <f7-list strong inset dividers class="margin-vertical skeleton-text" v-if="loading">
            <f7-list-input label="Account Name" placeholder="Your account name"></f7-list-input>
            <f7-list-item class="list-item-with-header-and-title list-item-with-multi-item">
                <template #default>
                    <div class="grid grid-cols-2">
                        <div class="list-item-subitem no-chevron">
                            <a class="item-link" href="#">
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-header">
                                            <span>Account Icon</span>
                                        </div>
                                        <div class="item-title">
                                            <div class="list-item-custom-title no-padding">
                                                <f7-icon f7="app_fill"></f7-icon>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="list-item-subitem no-chevron">
                            <a class="item-link" href="#">
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-header">
                                            <span>Account Color</span>
                                        </div>
                                        <div class="item-title">
                                            <div class="list-item-custom-title no-padding">
                                                <f7-icon f7="app_fill"></f7-icon>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </template>
            </f7-list-item>
            <f7-list-item class="list-item-with-header-and-title list-item-no-item-after" header="Currency" title="Currency" :link="editAccountId ? null : '#'"></f7-list-item>
            <f7-list-item class="list-item-with-header-and-title" header="Account Balance" title="Balance"></f7-list-item>
            <f7-list-item class="list-item-toggle" header="Visible" after="True"></f7-list-item>
            <f7-list-input label="Description" type="textarea" placeholder="Your account description (optional)"></f7-list-input>
        </f7-list>

        <f7-list form strong inset dividers class="margin-vertical" v-else-if="!loading && account.type === AccountType.SingleAccount.type">
            <f7-list-input
                type="text"
                clear-button
                :label="tt('Account Name')"
                :placeholder="tt('Your account name')"
                v-model:value="account.name"
            ></f7-list-input>

            <f7-list-item class="list-item-with-header-and-title list-item-with-multi-item">
                <template #default>
                    <div class="grid grid-cols-2">
                        <div class="list-item-subitem no-chevron">
                            <a class="item-link" href="#" @click="accountContext.showIconSelectionSheet = true">
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-header">
                                            <span>{{ tt('Account Icon') }}</span>
                                        </div>
                                        <div class="item-title">
                                            <div class="list-item-custom-title no-padding">
                                                <ItemIcon icon-type="account" :icon-id="account.icon" :color="account.color"></ItemIcon>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>

                            <icon-selection-sheet :all-icon-infos="ALL_ACCOUNT_ICONS"
                                                  :color="account.color"
                                                  v-model:show="accountContext.showIconSelectionSheet"
                                                  v-model="account.icon"
                            ></icon-selection-sheet>
                        </div>
                        <div class="list-item-subitem no-chevron">
                            <a class="item-link" href="#" @click="accountContext.showColorSelectionSheet = true">
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-header">
                                            <span>{{ tt('Account Color') }}</span>
                                        </div>
                                        <div class="item-title">
                                            <div class="list-item-custom-title no-padding">
                                                <ItemIcon icon-type="fixed-f7" icon-id="app_fill" :color="account.color"></ItemIcon>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>

                            <color-selection-sheet :all-color-infos="ALL_ACCOUNT_COLORS"
                                                   v-model:show="accountContext.showColorSelectionSheet"
                                                   v-model="account.color"
                            ></color-selection-sheet>
                        </div>
                    </div>
                </template>
            </f7-list-item>

            <f7-list-item
                class="list-item-with-header-and-title list-item-no-item-after"
                link="#"
                :header="tt('Currency')"
                :no-chevron="!!editAccountId"
                @click="accountContext.showCurrencyPopup = true"
            >
                <template #title>
                    <div class="no-padding no-margin">
                        <span>{{ getCurrencyName(account.currency) }}&nbsp;</span>
                        <small class="smaller">{{ account.currency }}</small>
                    </div>
                </template>
                <list-item-selection-popup value-type="item"
                                           key-field="currencyCode" value-field="currencyCode"
                                           title-field="displayName" after-field="currencyCode"
                                           :title="tt('Currency Name')"
                                           :enable-filter="true"
                                           :filter-placeholder="tt('Currency')"
                                           :filter-no-items-text="tt('No results')"
                                           :items="allCurrencies"
                                           v-model:show="accountContext.showCurrencyPopup"
                                           v-model="account.currency">
                </list-item-selection-popup>
            </f7-list-item>

            <f7-list-item
                link="#"
                class="list-item-with-header-and-title list-item-no-item-after"
                :header="tt('Statement Date')"
                :title="getAccountCreditCardStatementDate(account.creditCardStatementDate)"
                v-if="isAccountSupportCreditCardStatementDate"
                @click="accountContext.showCreditCardStatementDatePopup = true"
            >
                <list-item-selection-popup value-type="item"
                                           key-field="day" value-field="day"
                                           title-field="displayName"
                                           :title="tt('Statement Date')"
                                           :enable-filter="true"
                                           :filter-placeholder="tt('Statement Date')"
                                           :filter-no-items-text="tt('No results')"
                                           :items="allAvailableMonthDays"
                                           v-model:show="accountContext.showCreditCardStatementDatePopup"
                                           v-model="account.creditCardStatementDate">
                </list-item-selection-popup>
            </f7-list-item>
            <f7-list-item
                link="#" no-chevron
                class="list-item-with-header-and-title"
                :header="tt('Interest Rate (%)')"
                :title="account.savingsInterestRate ? account.savingsInterestRate.toString() + '%' : ''"
                v-if="isAccountSupportSavingsFields"
                @click="accountContext.showSavingsInterestRateNumberPad = true"
            >
                <number-pad-sheet
                    :min-value="0"
                    :max-value="100"
                    :hint="tt('Interest Rate (%)')"
                    v-model:show="accountContext.showSavingsInterestRateNumberPad"
                    v-model="account.savingsInterestRate">
                </number-pad-sheet>
            </f7-list-item>

            <f7-list-item
                link="#" no-chevron
                class="list-item-with-header-and-title"
                :header="tt('Savings Period')"
                :title="formatSavingsPeriod(savingsPeriodInMonths)"
                v-if="isAccountSupportSavingsFields"
                @click="accountContext.showSavingsPeriodSelection = true"
            >
                <month-period-selection-sheet
                    v-model:show="accountContext.showSavingsPeriodSelection"
                    v-model="savingsPeriodInMonths">
                </month-period-selection-sheet>
            </f7-list-item>

            <f7-list-item
                link="#" no-chevron
                class="list-item-with-header-and-title"
                :header="tt('Savings Start Date')"
                :title="account.savingsStartDate ? formatDateTimeToLongDate(parseDateTimeFromUnixTime(account.savingsStartDate)) : ''"
                v-if="isAccountSupportSavingsFields"
                @click="accountContext.showSavingsStartDateSheet = true"
            >
                <date-time-selection-sheet
                    init-mode="date"
                    v-model:show="accountContext.showSavingsStartDateSheet"
                    v-model="account.savingsStartDate">
                </date-time-selection-sheet>
            </f7-list-item>

            <f7-list-item
                link="#" no-chevron
                class="list-item-with-header-and-title"
                :header="tt('Non-term Interest Rate (%)')"
                :title="account.nonTermInterestRate ? account.nonTermInterestRate.toString() + '%' : '0.1%'"
                v-if="isAccountSupportSavingsFields && savingsPeriodInMonths === 0"
                @click="accountContext.showNonTermInterestRateNumberPad = true"
            >
                <number-pad-sheet
                    :min-value="0"
                    :max-value="100"
                    :hint="tt('Non-term Interest Rate (%)')"
                    v-model:show="accountContext.showNonTermInterestRateNumberPad"
                    v-model="account.nonTermInterestRate">
                </number-pad-sheet>
            </f7-list-item>

            <f7-list-item
                :title="tt('Allow Early Withdrawal')"
                v-if="isAccountSupportSavingsFields && savingsPeriodInMonths > 0"
            >
                <f7-toggle :checked="account.earlyWithdrawalAllowed" @toggle:change="account.earlyWithdrawalAllowed = $event"></f7-toggle>
            </f7-list-item>

            <f7-list-item
                link="#" no-chevron
                class="list-item-with-header-and-title"
                :header="account.isLiability ? tt('Account Outstanding Balance') : tt('Account Balance')"
                :title="formatAccountDisplayBalance(account)"
                @click="accountContext.showBalanceSheet = true"
            >
                <number-pad-sheet :min-value="TRANSACTION_MIN_AMOUNT"
                                  :max-value="TRANSACTION_MAX_AMOUNT"
                                  :currency="account.currency"
                                  :flip-negative="account.isLiability"
                                  v-model:show="accountContext.showBalanceSheet"
                                  v-model="account.balance"
                ></number-pad-sheet>
            </f7-list-item>

            <f7-list-item
                class="account-edit-balancetime list-item-with-header-and-title"
                link="#" no-chevron
                v-show="account.balance"
                v-if="!editAccountId"
            >
                <template #header>
                    <div class="account-edit-balancetime-header" @click="showDateTimeDialog(accountContext, 'time')">{{ tt('Balance Time') }}</div>
                </template>
                <template #title>
                    <div class="account-edit-balancetime-title">
                        <div @click="showDateTimeDialog(accountContext, 'date')">{{ formatAccountBalanceDate(account) }}</div>&nbsp;<div class="account-edit-balancetime-time" @click="showDateTimeDialog(accountContext, 'time')">{{ formatAccountBalanceTime(account) }}</div>
                    </div>
                </template>
                <date-time-selection-sheet :init-mode="accountContext.balanceDateTimeSheetMode"
                                           :timezone-utc-offset="getDefaultTimezoneOffsetMinutes(account)"
                                           :model-value="account.balanceTime"
                                           v-model:show="accountContext.showBalanceDateTimeSheet"
                                           @update:model-value="updateAccountBalanceTime(account, $event)">
                </date-time-selection-sheet>
            </f7-list-item>

            <f7-list-item :title="tt('Visible')" v-if="editAccountId">
                <f7-toggle :checked="account.visible" @toggle:change="account.visible = $event"></f7-toggle>
            </f7-list-item>

            <f7-list-input
                type="textarea"
                style="height: auto"
                :label="tt('Description')"
                :placeholder="tt('Your account description (optional)')"
                v-textarea-auto-size
                v-model:value="account.comment"
            ></f7-list-input>
        </f7-list>

        <f7-list form strong inset dividers class="margin-vertical" v-else-if="!loading && account.type === AccountType.MultiSubAccounts.type">
            <f7-list-input
                type="text"
                clear-button
                :label="tt('Account Name')"
                :placeholder="tt('Your account name')"
                v-model:value="account.name"
            ></f7-list-input>

            <f7-list-item class="list-item-with-header-and-title list-item-with-multi-item">
                <template #default>
                    <div class="grid grid-cols-2">
                        <div class="list-item-subitem no-chevron">
                            <a class="item-link" href="#" @click="accountContext.showIconSelectionSheet = true">
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-header">
                                            <span>{{ tt('Account Icon') }}</span>
                                        </div>
                                        <div class="item-title">
                                            <div class="list-item-custom-title no-padding">
                                                <ItemIcon icon-type="account" :icon-id="account.icon" :color="account.color"></ItemIcon>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>

                            <icon-selection-sheet :all-icon-infos="ALL_ACCOUNT_ICONS"
                                                  :color="account.color"
                                                  v-model:show="accountContext.showIconSelectionSheet"
                                                  v-model="account.icon"
                            ></icon-selection-sheet>
                        </div>
                        <div class="list-item-subitem no-chevron">
                            <a class="item-link" href="#" @click="accountContext.showColorSelectionSheet = true">
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-header">
                                            <span>{{ tt('Account Color') }}</span>
                                        </div>
                                        <div class="item-title">
                                            <div class="list-item-custom-title no-padding">
                                                <ItemIcon icon-type="fixed-f7" icon-id="app_fill" :color="account.color"></ItemIcon>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>

                            <color-selection-sheet :all-color-infos="ALL_ACCOUNT_COLORS"
                                                   v-model:show="accountContext.showColorSelectionSheet"
                                                   v-model="account.color"
                            ></color-selection-sheet>
                        </div>
                    </div>
                </template>
            </f7-list-item>

            <f7-list-item
                link="#"
                class="list-item-with-header-and-title list-item-no-item-after"
                :header="tt('Statement Date')"
                :title="getAccountCreditCardStatementDate(account.creditCardStatementDate)"
                v-if="isAccountSupportCreditCardStatementDate"
                @click="accountContext.showCreditCardStatementDatePopup = true"
            >
                <list-item-selection-popup value-type="item"
                                           key-field="day" value-field="day"
                                           title-field="displayName"
                                           :title="tt('Statement Date')"
                                           :enable-filter="true"
                                           :filter-placeholder="tt('Statement Date')"
                                           :filter-no-items-text="tt('No results')"
                                           :items="allAvailableMonthDays"
                                           v-model:show="accountContext.showCreditCardStatementDatePopup"
                                           v-model="account.creditCardStatementDate">
                </list-item-selection-popup>
            </f7-list-item>

            <f7-list-item :title="tt('Visible')" v-if="editAccountId">
                <f7-toggle :checked="account.visible" @toggle:change="account.visible = $event"></f7-toggle>
            </f7-list-item>

            <f7-list-input
                type="textarea"
                style="height: auto"
                :label="tt('Description')"
                :placeholder="tt('Your account description (optional)')"
                v-textarea-auto-size
                v-model:value="account.comment"
            ></f7-list-input>
        </f7-list>

        <f7-block class="no-padding no-margin" v-if="!loading && account.type === AccountType.MultiSubAccounts.type">
            <f7-list strong inset dividers class="subaccount-edit-list margin-vertical"
                     :key="idx"
                     v-for="(subAccount, idx) in subAccounts">
                <f7-list-item group-title>
                    <small>{{ tt('Sub Account') + ' #' + (idx + 1) }}</small>
                    <f7-button rasied fill class="subaccount-delete-button" color="red" icon-f7="trash" icon-size="16px"
                               :tooltip="tt('Remove Sub-account')"
                               @click="removeSubAccount(subAccount, false)">
                    </f7-button>
                </f7-list-item>

                <f7-list-input
                    type="text"
                    clear-button
                    :label="tt('Sub-account Name')"
                    :placeholder="tt('Your sub-account name')"
                    v-model:value="subAccount.name"
                ></f7-list-input>

                <f7-list-item class="list-item-with-header-and-title list-item-with-multi-item">
                    <template #default>
                        <div class="grid grid-cols-2">
                            <div class="list-item-subitem no-chevron">
                                <a class="item-link" href="#" @click="subAccountContexts[idx]!.showIconSelectionSheet = true">
                                    <div class="item-content">
                                        <div class="item-inner">
                                            <div class="item-header">
                                                <span>{{ tt('Sub-account Icon') }}</span>
                                            </div>
                                            <div class="item-title">
                                                <div class="list-item-custom-title no-padding">
                                                    <ItemIcon icon-type="account" :icon-id="subAccount.icon" :color="subAccount.color"></ItemIcon>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>

                                <icon-selection-sheet :all-icon-infos="ALL_ACCOUNT_ICONS"
                                                      :color="subAccount.color"
                                                      v-model:show="subAccountContexts[idx]!.showIconSelectionSheet"
                                                      v-model="subAccount.icon"
                                ></icon-selection-sheet>
                            </div>
                            <div class="list-item-subitem no-chevron">
                                <a class="item-link" href="#" @click="subAccountContexts[idx]!.showColorSelectionSheet = true">
                                    <div class="item-content">
                                        <div class="item-inner">
                                            <div class="item-header">
                                                <span>{{ tt('Sub-account Color') }}</span>
                                            </div>
                                            <div class="item-title">
                                                <div class="list-item-custom-title no-padding">
                                                    <ItemIcon icon-type="account" :icon-id="subAccount.icon" :color="subAccount.color"></ItemIcon>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>

                                <color-selection-sheet :all-color-infos="ALL_ACCOUNT_COLORS"
                                                       v-model:show="subAccountContexts[idx]!.showColorSelectionSheet"
                                                       v-model="subAccount.color"
                                ></color-selection-sheet>
                            </div>
                        </div>
                    </template>
                </f7-list-item>

                <f7-list-item
                    class="list-item-with-header-and-title list-item-no-item-after"
                    link="#"
                    :header="tt('Currency')"
                    :no-chevron="!!editAccountId && !isNewAccount(subAccount)"
                    @click="subAccountContexts[idx]!.showCurrencyPopup = true"
                >
                    <template #title>
                        <div class="no-padding no-margin">
                            <span>{{ getCurrencyName(subAccount.currency) }}&nbsp;</span>
                            <small class="smaller">{{ subAccount.currency }}</small>
                        </div>
                    </template>
                    <list-item-selection-popup value-type="item"
                                               key-field="currencyCode" value-field="currencyCode"
                                               title-field="displayName" after-field="currencyCode"
                                               :title="tt('Currency Name')"
                                               :enable-filter="true"
                                               :filter-placeholder="tt('Currency')"
                                               :filter-no-items-text="tt('No results')"
                                               :items="allCurrencies"
                                               v-model:show="subAccountContexts[idx]!.showCurrencyPopup"
                                               v-model="subAccount.currency">
                    </list-item-selection-popup>
                </f7-list-item>

                <f7-list-item
                    link="#" no-chevron
                    class="list-item-with-header-and-title"
                    :header="account.isLiability ? tt('Sub-account Outstanding Balance') : tt('Sub-account Balance')"
                    :title="formatAccountDisplayBalance(subAccount)"
                    @click="subAccountContexts[idx]!.showBalanceSheet = true"
                >
                    <number-pad-sheet :min-value="TRANSACTION_MIN_AMOUNT"
                                      :max-value="TRANSACTION_MAX_AMOUNT"
                                      :currency="subAccount.currency"
                                      :flip-negative="account.isLiability"
                                      v-model:show="subAccountContexts[idx]!.showBalanceSheet"
                                      v-model="subAccount.balance"
                    ></number-pad-sheet>
                </f7-list-item>

                <f7-list-item
                    class="account-edit-balancetime list-item-with-header-and-title"
                    link="#" no-chevron
                    v-show="subAccount.balance"
                    v-if="!editAccountId || isNewAccount(subAccount)"
                >
                    <template #header>
                        <div class="account-edit-balancetime-header" @click="showDateTimeDialog(subAccountContexts[idx] as AccountContext, 'time')">{{ tt('Sub-account Balance Time') }}</div>
                    </template>
                    <template #title>
                        <div class="account-edit-balancetime-title">
                            <div @click="showDateTimeDialog(subAccountContexts[idx] as AccountContext, 'date')">{{ formatAccountBalanceDate(subAccount) }}</div>&nbsp;<div class="account-edit-balancetime-time" @click="showDateTimeDialog(subAccountContexts[idx] as AccountContext, 'time')">{{ formatAccountBalanceTime(subAccount) }}</div>
                        </div>
                    </template>
                    <date-time-selection-sheet :init-mode="subAccountContexts[idx]!.balanceDateTimeSheetMode"
                                               :timezone-utc-offset="getDefaultTimezoneOffsetMinutes(subAccount)"
                                               :model-value="subAccount.balanceTime"
                                               v-model:show="subAccountContexts[idx]!.showBalanceDateTimeSheet"
                                               @update:model-value="updateAccountBalanceTime(subAccount, $event)">
                    </date-time-selection-sheet>
                </f7-list-item>

                <f7-list-item
                    link="#" no-chevron
                    class="list-item-with-header-and-title"
                    :header="tt('Interest Rate (%)')"
                    :title="subAccount.savingsInterestRate ? subAccount.savingsInterestRate.toString() + '%' : ''"
                    v-if="subAccount.category === AccountCategory.SavingsAccount.type"
                    @click="subAccountContexts[idx] && (subAccountContexts[idx]!.showSavingsInterestRateNumberPad = true)"
                >
                    <number-pad-sheet
                        :min-value="0"
                        :max-value="100"
                        :hint="tt('Interest Rate (%)')"
                        v-model:show="subAccountContexts[idx]!.showSavingsInterestRateNumberPad"
                        v-model="subAccount.savingsInterestRate">
                    </number-pad-sheet>
                </f7-list-item>

                <f7-list-item
                    link="#" no-chevron
                    class="list-item-with-header-and-title"
                    :header="tt('Savings Period')"
                    :title="formatSavingsPeriod(subAccountSavingsPeriodInMonths[idx] || 0)"
                    v-if="subAccount.category === AccountCategory.SavingsAccount.type"
                    @click="subAccountContexts[idx] && (subAccountContexts[idx]!.showSavingsPeriodSelection = true)"
                >
                    <month-period-selection-sheet
                        v-model:show="subAccountContexts[idx]!.showSavingsPeriodSelection"
                        v-model="subAccountSavingsPeriodInMonths[idx]">
                    </month-period-selection-sheet>
                </f7-list-item>

                <f7-list-item
                    link="#" no-chevron
                    class="list-item-with-header-and-title"
                    :header="tt('Savings Start Date')"
                    :title="subAccount.savingsStartDate ? formatDateTimeToLongDate(parseDateTimeFromUnixTime(subAccount.savingsStartDate)) : ''"
                    v-if="subAccount.category === AccountCategory.SavingsAccount.type"
                    @click="subAccountContexts[idx] && (subAccountContexts[idx]!.showSavingsStartDateSheet = true)"
                >
                    <date-time-selection-sheet
                        init-mode="date"
                        v-model:show="subAccountContexts[idx]!.showSavingsStartDateSheet"
                        v-model="subAccount.savingsStartDate">
                    </date-time-selection-sheet>
                </f7-list-item>

                <f7-list-item
                    link="#" no-chevron
                    class="list-item-with-header-and-title"
                    :header="tt('Non-term Interest Rate (%)')"
                    :title="subAccount.nonTermInterestRate ? subAccount.nonTermInterestRate.toString() + '%' : '0.1%'"
                    v-if="subAccount.category === AccountCategory.SavingsAccount.type && (subAccountSavingsPeriodInMonths[idx] || 0) === 0"
                    @click="subAccountContexts[idx] && (subAccountContexts[idx]!.showNonTermInterestRateNumberPad = true)"
                >
                    <number-pad-sheet
                        :min-value="0"
                        :max-value="100"
                        :hint="tt('Non-term Interest Rate (%)')"
                        v-model:show="subAccountContexts[idx]!.showNonTermInterestRateNumberPad"
                        v-model="subAccount.nonTermInterestRate">
                    </number-pad-sheet>
                </f7-list-item>

                <f7-list-item
                    :title="tt('Allow Early Withdrawal')"
                    v-if="subAccount.category === AccountCategory.SavingsAccount.type && (subAccountSavingsPeriodInMonths[idx] || 0) > 0"
                >
                    <f7-toggle :checked="subAccount.earlyWithdrawalAllowed" @toggle:change="subAccount.earlyWithdrawalAllowed = $event"></f7-toggle>
                </f7-list-item>

                <f7-list-item :title="tt('Visible')" v-if="editAccountId && !isNewAccount(subAccount)">
                    <f7-toggle :checked="subAccount.visible" @toggle:change="subAccount.visible = $event"></f7-toggle>
                </f7-list-item>

                <f7-list-input
                    type="textarea"
                    style="height: auto"
                    :label="tt('Description')"
                    :placeholder="tt('Your sub-account description (optional)')"
                    v-textarea-auto-size
                    v-model:value="subAccount.comment"
                ></f7-list-input>
            </f7-list>
        </f7-block>

        <f7-actions close-by-outside-click close-on-escape :opened="showMoreActionSheet" @actions:closed="showMoreActionSheet = false">
            <f7-actions-group>
                <f7-actions-button @click="addSubAccountAndContext">{{ tt('Add Sub-account') }}</f7-actions-button>
            </f7-actions-group>
            <f7-actions-group>
                <f7-actions-button bold close>{{ tt('Cancel') }}</f7-actions-button>
            </f7-actions-group>
        </f7-actions>

        <f7-actions close-by-outside-click close-on-escape :opened="showDeleteActionSheet" @actions:closed="showDeleteActionSheet = false">
            <f7-actions-group>
                <f7-actions-label>{{ tt('Are you sure you want to remove this sub-account?') }}</f7-actions-label>
                <f7-actions-button color="red" @click="removeSubAccount(subAccountToDelete, true)">{{ tt('Remove') }}</f7-actions-button>
            </f7-actions-group>
            <f7-actions-group>
                <f7-actions-button bold close>{{ tt('Cancel') }}</f7-actions-button>
            </f7-actions-group>
        </f7-actions>
    </f7-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Router } from 'framework7/types';

import { useI18n } from '@/locales/helpers.ts';
import { useI18nUIComponents, showLoading, hideLoading } from '@/lib/ui/mobile.ts';
import { useAccountEditPageBase } from '@/views/base/accounts/AccountEditPageBase.ts';

import { useAccountsStore } from '@/stores/account.ts';

import { itemAndIndex } from '@/core/base.ts';
import type { LocalizedCurrencyInfo } from '@/core/currency.ts';
import { AccountType, AccountCategory } from '@/core/account.ts';
import { ALL_ACCOUNT_ICONS } from '@/consts/icon.ts';
import { ALL_ACCOUNT_COLORS } from '@/consts/color.ts';
import { TRANSACTION_MIN_AMOUNT, TRANSACTION_MAX_AMOUNT } from '@/consts/transaction.ts';
import type { Account } from '@/models/account.ts';

import { isDefined, findDisplayNameByType } from '@/lib/common.ts';
import { generateRandomUUID } from '@/lib/misc.ts';
import {
    getTimezoneOffsetMinutes,
    parseDateTimeFromUnixTimeWithTimezoneOffset,
    parseDateTimeFromUnixTime
} from '@/lib/datetime.ts';

interface AccountContext {
    showIconSelectionSheet: boolean;
    showColorSelectionSheet: boolean;
    showCurrencyPopup: boolean;
    showCreditCardStatementDatePopup: boolean;
    showSavingsInterestRateNumberPad: boolean;
    showSavingsEndDatePopup: boolean;
    showSavingsPeriodSelection: boolean;
    showSavingsStartDateSheet: boolean;
    showNonTermInterestRateNumberPad: boolean;
    showBalanceSheet: boolean;
    showBalanceDateTimeSheet: boolean;
    balanceDateTimeSheetMode: string;
}
import { TransactionType } from '@/core/transaction.ts';

const props = defineProps<{
    f7route: Router.Route;
    f7router: Router.Router;
}>();

const {
    tt,
    getAllCurrencies,
    getCurrencyName,
    formatDateTimeToLongDate,
    formatDateTimeToLongTime,
    formatAmountToLocalizedNumeralsWithCurrency
} = useI18n();

const { showAlert, showToast, routeBackOnError } = useI18nUIComponents();

const {
    editAccountId,
    clientSessionId,
    loading,
    submitting,
    account,
    subAccounts,
    title,
    inputEmptyProblemMessage,
    inputIsEmpty,
    allAccountCategories,
    allAccountTypes,
    allAvailableMonthDays,
    isAccountSupportCreditCardStatementDate,
    isAccountSupportSavingsFields,
    getDefaultTimezoneOffsetMinutes,
    getAccountCreditCardStatementDate,
    updateAccountBalanceTime,
    isNewAccount,
    addSubAccount,
    setAccount
} = useAccountEditPageBase();

const accountsStore = useAccountsStore();

const DEFAULT_ACCOUNT_CONTEXT: AccountContext = {
    showIconSelectionSheet: false,
    showColorSelectionSheet: false,
    showCurrencyPopup: false,
    showCreditCardStatementDatePopup: false,
    showSavingsInterestRateNumberPad: false,
    showSavingsEndDatePopup: false,
    showSavingsPeriodSelection: false,
    showSavingsStartDateSheet: false,
    showNonTermInterestRateNumberPad: false,
    showBalanceSheet: false,
    showBalanceDateTimeSheet: false,
    balanceDateTimeSheetMode: 'time'
};

const accountContext = ref<AccountContext>(Object.assign({}, DEFAULT_ACCOUNT_CONTEXT));
const subAccountContexts = ref<AccountContext[]>([]);
const subAccountToDelete = ref<Account | null>(null);
const loadingError = ref<unknown | null>(null);
const showAccountCategorySheet = ref<boolean>(false);
const showAccountTypeSheet = ref<boolean>(false);
const showMoreActionSheet = ref<boolean>(false);
const showDeleteActionSheet = ref<boolean>(false);

const allCurrencies = computed<LocalizedCurrencyInfo[]>(() => getAllCurrencies());
const savingsPeriodInMonths = ref<number>(0);
const subAccountSavingsPeriodInMonths = ref<number[]>([]);

function formatAccountDisplayBalance(selectedAccount: Account): string {
    const balance = account.value.isLiability ? -selectedAccount.balance : selectedAccount.balance;
    return formatAmountToLocalizedNumeralsWithCurrency(balance, selectedAccount.currency);
}

function formatAccountBalanceDate(account: Account): string {
    if (!isDefined(account.balanceTime)) {
        return '';
    }

    const dateTime = parseDateTimeFromUnixTimeWithTimezoneOffset(account.balanceTime, getTimezoneOffsetMinutes(account.balanceTime));
    return formatDateTimeToLongDate(dateTime);
}

function formatAccountBalanceTime(account: Account): string {
    if (!isDefined(account.balanceTime)) {
        return '';
    }

    const dateTime = parseDateTimeFromUnixTimeWithTimezoneOffset(account.balanceTime, getTimezoneOffsetMinutes(account.balanceTime));
    return formatDateTimeToLongTime(dateTime);
}

function formatSavingsPeriod(months: number): string {
    if (months <= 0) {
        return '';
    }
    
    if (months === 1) {
        return tt('1 month');
    }
    
    return `${months} ${tt('months')}`;
}

function init(): void {
    const query = props.f7route.query;
    clientSessionId.value = generateRandomUUID();

    if (query['id']) {
        loading.value = true;

        editAccountId.value = query['id'];

        accountsStore.getAccount({
            accountId: editAccountId.value
        }).then(response => {
            setAccount(response);
            subAccountContexts.value = [];
            subAccountSavingsPeriodInMonths.value = [];

            for (let i = 0; i < subAccounts.value.length; i++) {
                subAccountContexts.value.push(Object.assign({}, DEFAULT_ACCOUNT_CONTEXT));
                
                // Initialize sub-account savings period from existing end date
                const subAccount = subAccounts.value[i];
                if (subAccount && subAccount.savingsEndDate && subAccount.savingsEndDate > 0) {
                    const currentDate = new Date();
                    const targetDate = new Date(subAccount.savingsEndDate * 1000);
                    const diffTime = targetDate.getTime() - currentDate.getTime();
                    const diffMonths = Math.round(diffTime / (1000 * 60 * 60 * 24 * 30.44));
                    subAccountSavingsPeriodInMonths.value.push(diffMonths > 0 ? diffMonths : 0);
                } else if (subAccount && subAccount.savingsTermMonths && subAccount.savingsTermMonths > 0) {
                    // Use the term months if available
                    subAccountSavingsPeriodInMonths.value.push(subAccount.savingsTermMonths);
                } else if (account.value.category === AccountCategory.SavingsAccount.type) {
                    // Default to 12 months for new savings account sub-accounts
                    subAccountSavingsPeriodInMonths.value.push(12);
                } else {
                    subAccountSavingsPeriodInMonths.value.push(0);
                }
            }

            loading.value = false;
        }).catch(error => {
            if (error.processed) {
                loading.value = false;
            } else {
                loadingError.value = error;
                showToast(error.message || error);
            }
        });
    } else {
        loading.value = false;
    }
}

function save(): void {
    const router = props.f7router;
    const problemMessage = inputEmptyProblemMessage.value;

    if (problemMessage) {
        showAlert(problemMessage);
        return;
    }

    submitting.value = true;
    showLoading(() => submitting.value);

    accountsStore.saveAccount({
        account: account.value,
        subAccounts: subAccounts.value,
        isEdit: !!editAccountId.value,
        clientSessionId: clientSessionId.value
    }).then(() => {
        submitting.value = false;
        hideLoading();

        if (!editAccountId.value) {
            showToast('You have added a new account');
        } else {
            showToast('You have saved this account');
        }

        router.back();
    }).catch(error => {
        submitting.value = false;
        hideLoading();

        if (!error.processed) {
            showToast(error.message || error);
        }
    });
}

function addSubAccountAndContext(): void {
    if (addSubAccount()) {
        subAccountContexts.value.push(Object.assign({}, DEFAULT_ACCOUNT_CONTEXT));
        // Set default savings period to 12 months for savings accounts
        const defaultPeriod = account.value.category === AccountCategory.SavingsAccount.type ? 12 : 0;
        subAccountSavingsPeriodInMonths.value.push(defaultPeriod);
    }
}

function removeSubAccount(currentSubAccount: Account | null, confirm: boolean): void {
    if (!currentSubAccount) {
        showAlert('An error occurred');
        return;
    }

    if (!confirm) {
        subAccountToDelete.value = currentSubAccount;
        showDeleteActionSheet.value = true;
        return;
    }

    showDeleteActionSheet.value = false;
    subAccountToDelete.value = null;

    for (const [subAccount, index] of itemAndIndex(subAccounts.value)) {
        if (subAccount === currentSubAccount) {
            subAccounts.value.splice(index, 1);
            subAccountContexts.value.splice(index, 1);
            subAccountSavingsPeriodInMonths.value.splice(index, 1);
        }
    }
}

function showDateTimeDialog(accountContext: AccountContext, sheetMode: string): void {
    accountContext.balanceDateTimeSheetMode = sheetMode;
    accountContext.showBalanceDateTimeSheet = true;
}

function onPageAfterIn(): void {
    routeBackOnError(props.f7router, loadingError);
}

watch(() => account.value.type, () => {
    if (subAccounts.value.length < 1) {
        addSubAccountAndContext();
    }
});

watch(() => JSON.stringify(subAccounts.value), (newBalance, oldBalance) => {
    const newSubAccounts = JSON.parse(newBalance) as Account[];
    const oldSubAccounts = JSON.parse(oldBalance) as Account[];
    if (newSubAccounts.length !== oldSubAccounts.length) {
        return;
    }

    let newDiffAccount: Account | null = null;
    let oldDiffAccount: Account | null = null;

    for (let i = 0; i < newSubAccounts.length; i++) {
        if (newSubAccounts[i] && oldSubAccounts[i] && newSubAccounts[i]!.balance !== oldSubAccounts[i]!.balance) {
            newDiffAccount = newSubAccounts[i]!;
            oldDiffAccount = oldSubAccounts[i]!;
            break;
        }
    }

    if (!newDiffAccount || !oldDiffAccount) {
        return;
    }

    const diff = newDiffAccount.balance - oldDiffAccount.balance;
    const amountDiff = Math.abs(diff);
    const router = props.f7router;
    if(diff < 0) {
        const url = `/transaction/add?amount=${amountDiff}&type=${TransactionType.Expense.toString()}&accountId=${newDiffAccount.id}`;
        router.navigate(url);
    } else if(diff > 0) {
        const url = `/transaction/add?amount=${amountDiff}&type=${TransactionType.Income.toString()}&accountId=${newDiffAccount.id}`;
        router.navigate(url);
    }
});

watch(() => account.value.balance, (newBalance, oldBalance) => {
    if(!oldBalance) {
        return;
    }
    const diff = newBalance - oldBalance;
    const amountDiff = Math.abs(diff);
    const router = props.f7router;

    if(diff < 0) {
        const url = `/transaction/add?amount=${amountDiff}&type=${TransactionType.Expense.toString()}&accountId=${account.value.id}`;
        router.navigate(url);
    } else if(diff > 0) {
        const url = `/transaction/add?amount=${amountDiff}&type=${TransactionType.Income.toString()}&accountId=${account.value.id}`;
        router.navigate(url);
    }
});

// Convert months to end date when savings period changes
watch(savingsPeriodInMonths, (newMonths) => {
    if (newMonths > 0) {
        const currentDate = new Date();
        const endDate = new Date(currentDate);
        endDate.setMonth(endDate.getMonth() + newMonths);
        account.value.savingsEndDate = Math.floor(endDate.getTime() / 1000);
    } else {
        account.value.savingsEndDate = 0;
    }
});

// Convert months to end date for sub-accounts when savings period changes
watch(subAccountSavingsPeriodInMonths, (newMonthsArray, oldMonthsArray) => {
    for (let i = 0; i < newMonthsArray.length && i < subAccounts.value.length; i++) {
        if (!oldMonthsArray || newMonthsArray[i] !== oldMonthsArray[i]) {
            if (newMonthsArray[i] && newMonthsArray[i]! > 0) {
                const currentDate = new Date();
                const endDate = new Date(currentDate);
                endDate.setMonth(endDate.getMonth() + newMonthsArray[i]!);
                if (subAccounts.value[i]) {
                    subAccounts.value[i]!.savingsEndDate = Math.floor(endDate.getTime() / 1000);
                }
            } else {
                if (subAccounts.value[i]) {
                    subAccounts.value[i]!.savingsEndDate = 0;
                }
            }
        }
    }
}, { deep: true });

// Initialize savings period from existing end date or term months
watch(() => account.value.savingsEndDate, (endDate) => {
    if (endDate && endDate > 0) {
        const currentDate = new Date();
        const targetDate = new Date(endDate * 1000);
        const diffTime = targetDate.getTime() - currentDate.getTime();
        const diffMonths = Math.round(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average month length
        
        if (diffMonths > 0 && savingsPeriodInMonths.value === 0) {
            savingsPeriodInMonths.value = diffMonths;
        }
    } else if (account.value.savingsTermMonths && account.value.savingsTermMonths > 0 && savingsPeriodInMonths.value === 0) {
        // Use the term months if available
        savingsPeriodInMonths.value = account.value.savingsTermMonths;
    } else if (account.value.category === AccountCategory.SavingsAccount.type && savingsPeriodInMonths.value === 0) {
        // Default to 12 months for new savings accounts
        savingsPeriodInMonths.value = 12;
    }
}, { immediate: true });

init();
</script>

<style>

.account-edit-balancetime .item-title {
    width: 100%;
}

.account-edit-balancetime .item-title > .item-header > .account-edit-balancetime-header {
    display: block;
    width: 100%;
}

.account-edit-balancetime .item-title > .account-edit-balancetime-title {
    display: flex;
    width: 100%;
}

.account-edit-balancetime .item-title > .account-edit-balancetime-title > .account-edit-balancetime-time {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}

.subaccount-delete-button {
    margin-inline-start: auto;
}
</style>
