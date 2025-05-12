<script lang="ts">
    import type { Prayer } from "$lib/dto/dto";
    export let prayer: Prayer;
    function formatTime(time24: string): string {
        const [hour, minute] = time24.split(":").map(Number);
        const period = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
    }
</script>

<div
    class="{prayer.isNext ? '' : ''} 
        bg-white rounded-lg shadow-sm transition-colors p-4 flex items-center justify-between bg-bottom bg-cover bg-no-repeat dark:bg-green-950/30 dark:border dark:border-green-500 dark:shadow-md dark:shadow-green-500 inset-shadow-md inset-shadow-white/50 dark:inset-shadow-green-950/50
        "
    style="background-image: url('{prayer.img}');"
>
    <div>
        <div class="font-medium text-gray-800 dark:text-white text-lg">
            {prayer.name}
        </div>
        <div class="text-gray-600 dark:text-gray-300 font-mono">
            {formatTime(prayer.time)}
        </div>
    </div>

    {#if prayer.isNext}
        <div
            class="bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full"
        >
            Next
        </div>
    {/if}
</div>
