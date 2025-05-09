<script lang="ts">
    export let isCurrentSolah: boolean;
</script>

<div class=" bg-white dark:bg-green-950/30 dark:border dark:border-green-500 dark:shadow-md dark:shadow-green-500 rounded-lg p-2 dark:text-white">
    {#if isCurrentSolah}
        <h2
            class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center"
        >
            <svg
                class="w-6 h-6 mr-2 text-green-400 dark:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                />
            </svg>
            Current Prayer
        </h2>
        {:else}
        <h2
            class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center"
        >
            <svg
                class="w-6 h-6 mr-2 text-green-400 dark:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                />
            </svg>
            Next Prayer
        </h2>
    {/if}
</div>
