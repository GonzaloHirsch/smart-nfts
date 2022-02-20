<template>
    <div class="flex flex-col items-center justify-center">
        <div class="flex flex-row">
            <div
                :class="['pagination--item', hasFirst ? 'pagination--item--active' : 'pagination--item--inactive']"
                @click="hasFirst ? handleGoPage(props.pagination.Links.first) : undefined"
                :aria-label="$t('pagination.aria.first')"
            >
                <ChevronDoubleLeftIcon class="pagination--item-icon" />
            </div>
            <div
                :class="['pagination--item', hasPrev ? 'pagination--item--active' : 'pagination--item--inactive']"
                @click="hasPrev ? handleGoPage(props.pagination.Links.previous) : undefined"
                :aria-label="$t('pagination.aria.prev')"
            >
                <ChevronLeftIcon class="pagination--item-icon" />
            </div>
            <div class="pagination--item pagination--item--current">
                {{ currentPage }}
            </div>
            <div
                :class="['pagination--item', hasNext ? 'pagination--item--active' : 'pagination--item--inactive']"
                @click="hasNext ? handleGoPage(props.pagination.Links.next) : undefined"
                :aria-label="$t('pagination.aria.next')"
            >
                <ChevronRightIcon class="pagination--item-icon" />
            </div>
            <div
                :class="['pagination--item', hasLast ? 'pagination--item--active' : 'pagination--item--inactive']"
                @click="hasLast ? handleGoPage(props.pagination.Links.last) : undefined"
                :aria-label="$t('pagination.aria.last')"
            >
                <ChevronDoubleRightIcon class="pagination--item-icon" />
            </div>
        </div>
        <div class="mt-xs text-sm">
            ({{
                $t('pagination.results', [
                    (props.pagination.page - 1) * props.pagination.perPage + 1,
                    props.pagination.page * props.pagination.perPage > props.pagination.totalCount
                        ? props.pagination.totalCount
                        : props.pagination.page * props.pagination.perPage,
                    props.pagination.totalCount
                ])
            }})
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { PAGINATION_PARAM, API_PAGINATION_PARAM_PAGE } from '@/js/constants.js';

import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/vue/solid';

const props = defineProps({
    pagination: {
        type: Object,
        default: {}
    }
});

const route = useRoute(),
    router = useRouter();

// Get current page by computing the url
const currentPage = computed(() => {
    let _page = route.query[PAGINATION_PARAM];
    if (_page && !isNaN(_page)) {
        return parseInt(_page, 10);
    }
    return 1;
});

// Check if has values
const hasNext = computed(() => props.pagination.Links.next !== null);
const hasPrev = computed(() => props.pagination.Links.previous !== null);
const hasFirst = computed(() => props.pagination.Links.first !== null);
const hasLast = computed(() => props.pagination.Links.last !== null);

const handleGoPage = (pageUrl) => {
    const _query = { ...route.query };
    // Calculate url query params
    const queryParams = pageUrl
        .split('?')[1]
        .split('&')
        .map((queryPair) => {
            const parts = queryPair.split('=');
            return {
                k: parts[0],
                v: parts[1]
            };
        })
        .reduce((accum, current) => {
            accum[current.k] = current.v;
            return accum;
        }, {});
    // Set the new param
    _query[PAGINATION_PARAM] = queryParams[API_PAGINATION_PARAM_PAGE];
    router.push({ path: route.path, query: _query });
};
</script>

<style scoped>
/* ITEMS */
.pagination--item:first-of-type {
    @apply mr-xs;
}

.pagination--item:last-of-type {
    @apply ml-xs;
}

.pagination--item:not(:first-of-type):not(:last-of-type) {
    @apply mx-xs;
}

.pagination--item {
    @apply py-xs px-3 text-typography_secondary border-2 rounded-md duration-200;
}

.pagination--item--current {
    @apply bg-brand_secondary/50 border-brand_secondary;
}

.pagination--item--active {
    @apply bg-brand_secondary/50 cursor-pointer border-brand_secondary;
}

.pagination--item--active:hover {
    @apply bg-brand_secondary/80;
}

.pagination--item--inactive {
    @apply bg-gray-300 cursor-not-allowed border-gray-600 invisible;
}

/* ICONS */
.pagination--item-icon {
    @apply w-6 h-6;
}
</style>
