<script lang="ts">
    import type { PrayerTimesResponse, Prayer } from "$lib/dto/dto";
    import { adhan } from "$lib/services/api";
    import AdhanCard from "./AdhanCard.svelte";
    export let lat: number;
    export let long: number;
    export let loading: boolean;
    let selectedMethod = "3";
    let prayerResponse: PrayerTimesResponse;
    let prayerList: Prayer[];
    export async function fetchPrayerTimes() {
        console.log("here");
        const today = new Date();
        const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
        prayerResponse = await adhan.prayerTime(
            dateStr,
            lat,
            long,
            selectedMethod,
        );
        if (prayerResponse && prayerResponse.code === 200) {
            // Extract prayer times
            const timings = prayerResponse.data.timings;
            prayerList = [
                {
                    name: "Fajr",
                    time: timings.Fajr,
                    isNext: false,
                    notified: false,
                    img: "",
                },
                {
                    name: "Sunrise",
                    time: timings.Sunrise,
                    isNext: false,
                    notified: false,
                    img: "",
                },
                {
                    name: "Dhuhr",
                    time: timings.Dhuhr,
                    isNext: false,
                    notified: false,
                    img: "",
                },
                {
                    name: "Asr",
                    time: timings.Asr,
                    isNext: false,
                    notified: false,
                    img: "",
                },
                {
                    name: "Maghrib",
                    time: timings.Maghrib,
                    isNext: false,
                    notified: false,
                    img: "",
                },
                {
                    name: "Isha",
                    time: timings.Isha,
                    isNext: false,
                    notified: false,
                    img: "",
                },
            ];

            // Get hijri date
            // hijriDate = `${data.data.date.hijri.date.substring(0, 2)} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year} ${data.data.date.hijri.designation.abbreviated}`;
            loading = false;
            // updateNextPrayer();
        } else {
            throw new Error("Failed to fetch prayer times");
        }
    }
</script>

{#each prayerList as prayer}
    <AdhanCard {prayer} />
{/each}
