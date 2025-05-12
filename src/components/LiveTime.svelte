<script lang="ts">
    import { onMount } from "svelte";

    let darkMode: boolean = false;
    let currentTime: Date = new Date();
    let clockInterval: number;
    export let hijriDate: string;
    function toggleDarkMode() {
        darkMode = !darkMode;
        localStorage.setItem("darkMode", String(darkMode));

        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }

    onMount(async () => {
        clockInterval = setInterval(() => {
            currentTime = new Date();
        }, 1000);
    });
</script>

<div class="flex mx-4 items-center justify-end">
    <div class="flex flex-col">
        <div class="flex items-center">
            <div class="text-lg font-medium text-gray-900 dark:text-white">
                {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })}
            </div>
            <button
                class="ml-4 p-2 rounded-full bg-gray-200 dark:bg-green-500 hover:bg-gray-300 dark:hover:bg-green-600 transition-colors cursor-pointer"
                on:click={toggleDarkMode}
                aria-label="Toggle dark mode"
            >
                {#if darkMode}
                    <svg
                        class="w-5 h-5 text-gray-600 hover:text-gray-100"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                            clip-rule="evenodd"
                        />
                    </svg>
                {:else}
                    <svg
                        class="w-5 h-5 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                        />
                    </svg>
                {/if}
            </button>
        </div>

        <div class=" text-right text-sm text-gray-600 dark:text-gray-300 my-1">
            {currentTime.toLocaleDateString([], {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })}
        </div>
        <div class="text-right text-xs text-gray-500 dark:text-gray-400">
            {hijriDate}
        </div>
    </div>
</div>
