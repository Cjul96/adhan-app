<script lang="ts">
    export let message: String;
</script>

<div class="flex flex-col items-center justify-center mt-10">
    <div
        class="w-16 h-16 border-4 border-blue-600 dark:border-blue-500 border-t-transparent dark:border-t-transparent rounded-full animate-spin mb-4"
    ></div>
    <p class="text-gray-600 dark:text-gray-300">Loading {message}...</p>
</div>
