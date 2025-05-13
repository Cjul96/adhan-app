<script lang="ts">
    import type { Prayer } from "$lib/dto/dto";
    import { onMount } from "svelte";
    import Loading from "./Loading.svelte";
    import { sendNotification } from "@tauri-apps/plugin-notification";
    export let isCurrentSolah: boolean;
    export let prayer: Prayer;
    export let notificationsEnabled = true;
    export let notificationPermissionGranted = false;
	export let notificationTime = 226; // minutes before prayer
    let adhanAudio: HTMLAudioElement;
    let message: string = "Prayer Time";
    let countdownText = "";
    let clockInterval: number;
    let adhanPlaying = false;

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
        const totalMinutes = diffHrs * 60 + diffMins;
        // Notification at exact notification time
        if (totalMinutes === notificationTime && diffSecs === 0) {
            sendPrayerNotification(
                prayer.name,
                notificationTime,
            );
            // Don't mark as notified yet - we'll have another notification at prayer time
        }

        // Notification at prayer time
        if (totalMinutes === 0 && diffSecs === 0) {
            sendPrayerNotification(prayer.name, 0);
            prayer.notified = true;
        }
    }
    // Play Adhan
    function toggleAdhan() {
        if (adhanPlaying) {
            adhanAudio.pause();
            adhanAudio.currentTime = 0;
            adhanPlaying = false;
        } else {
            adhanAudio.play();
            adhanPlaying = true;
        }
    }
    // Send prayer notification
    async function sendPrayerNotification(
        prayerName: string,
        minutesRemaining: number,
    ) {
        try {
            if (!notificationsEnabled || !notificationPermissionGranted) return;
            const message =
                minutesRemaining > 0
                    ? `${prayerName} prayer will be in ${minutesRemaining} minutes.`
                    : `It's time for ${prayerName} prayer.`;

            // Using the plugin-notification import
            await sendNotification({
                title: `Prayer Time: ${prayerName}`,
                body: message,
                icon: "public/icon.png", // Update this path as needed
            });

            // Play adhan audio
            if (!adhanPlaying && minutesRemaining == 0) toggleAdhan();
        } catch (error) {
            console.error("Error sending notification:", error);
        }
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

        // Initialize audio
        adhanAudio = new Audio("/audio/adhan.mp3");
        adhanAudio.addEventListener("ended", () => {
            adhanPlaying = false;
        });
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
    {:else}
        <button
            class="flex items-center bg-white dark:bg-green-500 text-black dark:text-white hover:bg-blue-50 dark:hover:bg-green-600 font-medium px-4 py-2 rounded-lg transition cursor-pointer"
            on:click={toggleAdhan}
        >
            {#if adhanPlaying}
                <svg
                    class="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                        clip-rule="evenodd"
                    />
                </svg>
                Stop Adhan
            {:else}
                <svg
                    class="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clip-rule="evenodd"
                    />
                </svg>
                Play Adhan
            {/if}
        </button>
    {/if}
</div>
