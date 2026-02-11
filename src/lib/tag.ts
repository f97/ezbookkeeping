import { TransactionTag } from '@/models/transaction_tag.ts';
import {
    isNoAvailableItem,
    getAvailableItemCount,
    getFirstShowingId as getFirstShowingItemId,
    getLastShowingId as getLastShowingItemId
} from '@/lib/common/visibility.ts';

export function isNoAvailableTag(tags: TransactionTag[], showHidden: boolean): boolean {
    return isNoAvailableItem(tags, showHidden);
}

export function getAvailableTagCount(tags: TransactionTag[], showHidden: boolean): number {
    return getAvailableItemCount(tags, showHidden);
}

export function getFirstShowingId(tags: TransactionTag[], showHidden: boolean): string | null {
    return getFirstShowingItemId(tags, showHidden);
}

export function getLastShowingId(tags: TransactionTag[], showHidden: boolean): string | null {
    return getLastShowingItemId(tags, showHidden);
}
