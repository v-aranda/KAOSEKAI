<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
    modelValue: { type: String, default: "" },
    placeholder: { type: String, default: "Buscar..." },
    ariaLabel: { type: String, default: "Buscar" },
    resultsCount: { type: Number, default: undefined },
});

const emit = defineEmits(["update:modelValue"]);
const hasQuery = computed(() => (props.modelValue ?? "").length > 0);
</script>

<template>
    <div class="search-bar">
        <span class="search-count" v-if="hasQuery && resultsCount !== undefined">
            {{ resultsCount }} resultado(s)
        </span>
        <input class="search-input" type="text" :value="modelValue"
            @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)" :placeholder="placeholder"
            :aria-label="ariaLabel" />
    </div>
</template>

<style scoped lang="scss">
.search-bar {
    margin-top: 12px;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;
}

.search-input {
    flex: 0 0 auto;
    width: clamp(180px, 25%, 320px);
    padding: 8px 10px;
    border: 2px solid var(--border-main);
    background: var(--bg-app);
    color: var(--text-primary);
    box-shadow: none;
    font-weight: 500;
    outline: none;
}

.search-input::placeholder {
    color: var(--text-secondary);
}

.search-count {
    color: var(--text-secondary);
    font-size: 0.75rem;
    opacity: 0.75;
}
</style>
