import { ref, computed, watch } from 'vue';

import { useI18n } from '@/locales/helpers.ts';

import { useUserStore } from '@/stores/user.ts';

import type { TypeAndDisplayName } from '@/core/base.ts';
import { AccountCategory, AccountType } from '@/core/account.ts';
import type { LocalizedAccountCategory } from '@/core/account.ts';
import { Account } from '@/models/account.ts';

import { getCurrentUnixTime } from '@/lib/datetime.ts';

export interface DayAndDisplayName {
    readonly day: number;
    readonly displayName: string;
}

export function useAccountEditPageBase() {
    const { tt, getAllAccountCategories, getAllAccountTypes, getMonthdayShortName } = useI18n();

    const userStore = useUserStore();

    const editAccountId = ref<string | null>(null);
    const clientSessionId = ref<string>('');
    const loading = ref<boolean>(false);
    const submitting = ref<boolean>(false);
    const account = ref<Account>(Account.createNewAccount(userStore.currentUserDefaultCurrency, getCurrentUnixTime()));
    const subAccounts = ref<Account[]>([]);

    const title = computed<string>(() => {
        if (!editAccountId.value) {
            return 'Add Account';
        } else {
            return 'Edit Account';
        }
    });

    const saveButtonTitle = computed<string>(() => {
        if (!editAccountId.value) {
            return 'Add';
        } else {
            return 'Save';
        }
    });

    const inputEmptyProblemMessage = computed<string | null>(() => {
        let problemMessage = getInputEmptyProblemMessage(account.value, false);

        if (problemMessage) {
            return problemMessage;
        }

        if (account.value.type === AccountType.MultiSubAccounts.type) {
            for (const subAccount of subAccounts.value) {
                problemMessage = getInputEmptyProblemMessage(subAccount, true);

                if (problemMessage) {
                    return problemMessage;
                }
            }
        }

        return null;
    });

    const inputIsEmpty = computed<boolean>(() => !!inputEmptyProblemMessage.value);

    const allAccountCategories = computed<LocalizedAccountCategory[]>(() => getAllAccountCategories());
    const allAccountTypes = computed<TypeAndDisplayName[]>(() => getAllAccountTypes());

    const allAvailableMonthDays = computed<DayAndDisplayName[]>(() => {
        const allAvailableDays: DayAndDisplayName[] = [];

        allAvailableDays.push({
            day: 0,
            displayName: tt('Not set'),
        });

        for (let i = 1; i <= 28; i++) {
            allAvailableDays.push({
                day: i,
                displayName: getMonthdayShortName(i),
            });
        }

        return allAvailableDays;
    });

    const isAccountSupportCreditCardStatementDate = computed<boolean>(() => account.value && account.value.category === AccountCategory.CreditCard.type);
    const isAccountSupportSavingsFields = computed<boolean>(() => account.value && account.value.category === AccountCategory.SavingsAccount.type);

    function getAccountCreditCardStatementDate(statementDate?: number): string | null {
        for (const item of allAvailableMonthDays.value) {
            if (item.day === statementDate) {
                return item.displayName;
            }
        }

        return null;
    }

    function calculateSavingsInterest(balance: number, interestRate: number, startDate: number, endDate: number): number {
        if (!balance || !interestRate || !startDate || !endDate || endDate <= startDate) {
            return 0;
        }

        const principal = balance / 100; // Convert from smallest currency unit
        const rate = interestRate / 100; // Convert percentage to decimal
        const daysBetween = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        const interest = principal * rate * (daysBetween / 365); // Simple interest calculation

        return Math.round(interest * 100); // Convert back to smallest currency unit
    }

    function getInputEmptyProblemMessage(account: Account, isSubAccount: boolean): string | null {
        if (!isSubAccount && !account.category) {
            return 'Account category cannot be blank';
        } else if (!isSubAccount && !account.type) {
            return 'Account type cannot be blank';
        } else if (!account.name) {
            return 'Account name cannot be blank';
        } else if (account.type === AccountType.SingleAccount.type && !account.currency) {
            return 'Account currency cannot be blank';
        } else {
            return null;
        }
    }

    function isNewAccount(account: Account): boolean {
        return account.id === '' || account.id === '0';
    }

    function addSubAccount(): boolean {
        if (account.value.type !== AccountType.MultiSubAccounts.type) {
            return false;
        }

        const subAccount = account.value.createNewSubAccount(userStore.currentUserDefaultCurrency, getCurrentUnixTime());
        subAccounts.value.push(subAccount);
        return true;
    }

    function setAccount(newAccount: Account): void {
        account.value.fillFrom(newAccount);
        subAccounts.value = [];

        if (newAccount.subAccounts && newAccount.subAccounts.length > 0) {
            for (const oldSubAccount of newAccount.subAccounts) {
                const subAccount: Account = account.value.createNewSubAccount(userStore.currentUserDefaultCurrency, getCurrentUnixTime());
                subAccount.fillFrom(oldSubAccount);

                subAccounts.value.push(subAccount);
            }
        }
    }

    watch(() => account.value.category, (newValue, oldValue) => {
        account.value.setSuitableIcon(oldValue, newValue);
        
        // Set default values when changing to savings account
        if (newValue === AccountCategory.SavingsAccount.type) {
            // Set default start date to today if not already set
            if (!account.value.savingsStartDate || account.value.savingsStartDate === 0) {
                account.value.savingsStartDate = getCurrentUnixTime();
            }
            
            // Set default term to 12 months if not already set
            if (!account.value.savingsTermMonths || account.value.savingsTermMonths === 0) {
                account.value.savingsTermMonths = 12;
            }
            
            // Set default interest rate to 7.5% if not already set
            if (!account.value.savingsInterestRate || account.value.savingsInterestRate === 0) {
                account.value.savingsInterestRate = 7.5;
            }
            
            // Calculate end date from start date + term if not already set
            if (!account.value.savingsEndDate || account.value.savingsEndDate === 0) {
                if (account.value.savingsStartDate && account.value.savingsTermMonths) {
                    const startDate = new Date(account.value.savingsStartDate * 1000);
                    const endDate = new Date(startDate);
                    endDate.setMonth(endDate.getMonth() + account.value.savingsTermMonths);
                    account.value.savingsEndDate = Math.floor(endDate.getTime() / 1000);
                }
            }
        }
    });

    return {
        // states
        editAccountId,
        clientSessionId,
        loading,
        submitting,
        account,
        subAccounts,
        // computed states
        title,
        saveButtonTitle,
        inputEmptyProblemMessage,
        inputIsEmpty,
        allAccountCategories,
        allAccountTypes,
        allAvailableMonthDays,
        isAccountSupportCreditCardStatementDate,
        isAccountSupportSavingsFields,
        // functions
        getAccountCreditCardStatementDate,
        calculateSavingsInterest,
        isNewAccount,
        addSubAccount,
        setAccount
    };
}
