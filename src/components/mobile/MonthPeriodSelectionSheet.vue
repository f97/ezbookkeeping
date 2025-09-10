<template>
    <f7-sheet swipe-to-close swipe-handler=".swipe-handler" style="height:auto"
              :opened="show" @sheet:open="onSheetOpen" @sheet:closed="onSheetClosed">
        <f7-toolbar>
            <div class="swipe-handler"></div>
            <div class="left">
                <f7-link :text="tt('Clear')" @click="clear"></f7-link>
            </div>
            <div class="right">
                <f7-link :text="tt('Done')" @click="confirm"></f7-link>
            </div>
        </f7-toolbar>
        <f7-page-content>
            <div class="block-title">{{ tt('Select Period') }}</div>
            <f7-list dividers class="no-margin-vertical">
                <f7-list-item link="#" no-chevron
                              :title="tt('3 months')"
                              :class="{ 'list-item-selected': selectedMonths === 3 }"
                              @click="selectPeriod(3)">
                    <template #content-start>
                        <f7-icon class="list-item-checked-icon" f7="checkmark_alt" :style="{ 'color': selectedMonths === 3 ? '' : 'transparent' }"></f7-icon>
                    </template>
                </f7-list-item>
                <f7-list-item link="#" no-chevron
                              :title="tt('6 months')"
                              :class="{ 'list-item-selected': selectedMonths === 6 }"
                              @click="selectPeriod(6)">
                    <template #content-start>
                        <f7-icon class="list-item-checked-icon" f7="checkmark_alt" :style="{ 'color': selectedMonths === 6 ? '' : 'transparent' }"></f7-icon>
                    </template>
                </f7-list-item>
                <f7-list-item link="#" no-chevron
                              :title="tt('12 months')"
                              :class="{ 'list-item-selected': selectedMonths === 12 }"
                              @click="selectPeriod(12)">
                    <template #content-start>
                        <f7-icon class="list-item-checked-icon" f7="checkmark_alt" :style="{ 'color': selectedMonths === 12 ? '' : 'transparent' }"></f7-icon>
                    </template>
                </f7-list-item>
                <f7-list-item link="#" no-chevron
                              :title="customMonthsDisplay"
                              :class="{ 'list-item-selected': selectedMonths !== 3 && selectedMonths !== 6 && selectedMonths !== 12 && selectedMonths > 0 }"
                              @click="showCustomMonthsInput = true">
                    <template #content-start>
                        <f7-icon class="list-item-checked-icon" f7="checkmark_alt" :style="{ 'color': (selectedMonths !== 3 && selectedMonths !== 6 && selectedMonths !== 12 && selectedMonths > 0) ? '' : 'transparent' }"></f7-icon>
                    </template>
                </f7-list-item>
            </f7-list>
            
            <number-pad-sheet
                :min-value="1"
                :max-value="240"
                :hint="tt('Custom months')"
                v-model:show="showCustomMonthsInput"
                v-model="customMonths">
            </number-pad-sheet>
        </f7-page-content>
    </f7-sheet>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import { useI18n } from '@/locales/helpers.ts';

const props = defineProps<{
    modelValue: number; // number of months
    show: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void;
    (e: 'update:show', value: boolean): void;
}>();

const { tt } = useI18n();

const selectedMonths = ref<number>(0);
const customMonths = ref<number>(1);
const showCustomMonthsInput = ref<boolean>(false);

const customMonthsDisplay = computed<string>(() => {
    if (selectedMonths.value > 0 && selectedMonths.value !== 3 && selectedMonths.value !== 6 && selectedMonths.value !== 12) {
        return `${selectedMonths.value} ${tt('months')}`;
    }
    return tt('Custom months');
});

function selectPeriod(months: number): void {
    selectedMonths.value = months;
}

function clear(): void {
    selectedMonths.value = 0;
    confirm();
}

function confirm(): void {
    emit('update:modelValue', selectedMonths.value);
    emit('update:show', false);
}

function onSheetOpen(): void {
    selectedMonths.value = props.modelValue || 0;
    if (selectedMonths.value > 0 && selectedMonths.value !== 3 && selectedMonths.value !== 6 && selectedMonths.value !== 12) {
        customMonths.value = selectedMonths.value;
    }
}

function onSheetClosed(): void {
    emit('update:show', false);
}

watch(customMonths, (newValue) => {
    if (showCustomMonthsInput.value && newValue > 0) {
        selectedMonths.value = newValue;
        showCustomMonthsInput.value = false;
    }
});
</script>

<style>
.list-item-selected {
    background-color: var(--f7-list-item-selected-bg-color, rgba(var(--f7-theme-color-rgb), 0.15));
}

.list-item-checked-icon {
    margin-inline-end: 8px;
}
</style>