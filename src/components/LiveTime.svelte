<script lang="ts">
    import type { Prayer } from "$lib/dto/dto";
    import { onMount } from "svelte";

    let darkMode: boolean = false;
    let currentTime: Date = new Date();
    let clockInterval: number;
	export let nextPrayer: Prayer;
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

<div class=" text-center">
    <img src="adhan icon.png" alt="" class=" h-10 mx-auto" />
    <span>Next prayer : {nextPrayer == undefined
        ? ''
        : nextPrayer.name}</span>
    <h1 class="text-4xl">
        {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })}
    </h1>
    <h6>
        {currentTime.toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })}
    </h6>
    <h6>{hijriDate}</h6>
</div>
