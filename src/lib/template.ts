import { TransactionTemplate } from '@/models/transaction_template.ts';
import {
    isNoAvailableItem,
    getAvailableItemCount,
    getFirstShowingId as getFirstShowingItemId,
    getLastShowingId as getLastShowingItemId
} from '@/lib/common/visibility.ts';

export function isNoAvailableTemplate(templates: TransactionTemplate[], showHidden: boolean): boolean {
    return isNoAvailableItem(templates, showHidden);
}

export function getAvailableTemplateCount(templates: TransactionTemplate[], showHidden: boolean): number {
    return getAvailableItemCount(templates, showHidden);
}

export function getFirstShowingId(templates: TransactionTemplate[], showHidden: boolean): string | null {
    return getFirstShowingItemId(templates, showHidden);
}

export function getLastShowingId(templates: TransactionTemplate[], showHidden: boolean): string | null {
    return getLastShowingItemId(templates, showHidden);
}
