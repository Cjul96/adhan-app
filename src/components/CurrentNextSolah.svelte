<script lang="ts">
    import type { Prayer } from "$lib/dto/dto";
    import { onMount } from "svelte";
    import Loading from "./Loading.svelte";
    let message: string = "Prayer Time";
    export let isCurrentSolah: boolean;
    export let prayer: Prayer;
    let countdownText = "";
    let clockInterval: number;

    function nextTime() {
        const currentTime = new Date();

        const [hours, minutes] = prayer.time.split(":").map(Number);
        const prayerTime = new Date(currentTime);
        prayerTime.setDate(
            currentTime.getDate() + (prayer.name == "Fajr (Tomorrow)" ? 1 : 0),
        );
        prayerTime.setHours(hours, minutes, 0, 0);
        const now = new Date();
        const diffMs = prayerTime.getTime() - now.getTime();

        // Calculate hours, minutes, seconds
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
        // console.log("hrs:" + diffHrs + " min:" + diffMins + " sec:" + diffSecs);
        // Format countdown
        countdownText = `${String(diffHrs).padStart(2, "0")}:${String(diffMins).padStart(2, "0")}:${String(diffSecs).padStart(2, "0")}`;
    }
    onMount(async () => {
        while (prayer == undefined) {
            await new Promise((f) => setTimeout(f, 1000));
        }
        if (!isCurrentSolah) {
            clockInterval = setInterval(async () => {
                nextTime();
            }, 1000);
        }
    });
</script>

<div
    class=" bg-white dark:bg-green-950/30 dark:border dark:border-green-500 dark:shadow-md dark:shadow-green-500 rounded-lg p-2 dark:text-white bg-bottom bg-cover bg-no-repeat inset-shadow-md inset-shadow-white/50 dark:inset-shadow-green-950/50"
    style="background-image: url('{prayer == undefined ? '' : prayer.img}');"
>
    {#if prayer == undefined}
        <Loading {message} />
    {:else if isCurrentSolah}
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
    <h3 class="text-3xl font-bold">{prayer?.name}</h3>
    {#if !isCurrentSolah}
        <span>{countdownText}</span>
    {/if}
</div>
