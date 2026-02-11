import { reversed } from '@/core/base.ts';

interface HidableItem {
    id: string;
    hidden?: boolean;
}

export function isNoAvailableItem<T extends HidableItem>(items: T[], showHidden: boolean): boolean {
    for (const item of items) {
        if (showHidden || !item.hidden) {
            return false;
        }
    }

    return true;
}

export function getAvailableItemCount<T extends HidableItem>(items: T[], showHidden: boolean): number {
    let count = 0;

    for (const item of items) {
        if (showHidden || !item.hidden) {
            count++;
        }
    }

    return count;
}

export function getFirstShowingId<T extends HidableItem>(items: T[], showHidden: boolean): string | null {
    for (const item of items) {
        if (showHidden || !item.hidden) {
            return item.id;
        }
    }

    return null;
}

export function getLastShowingId<T extends HidableItem>(items: T[], showHidden: boolean): string | null {
    for (const item of reversed(items)) {
        if (showHidden || !item.hidden) {
            return item.id;
        }
    }

    return null;
}
