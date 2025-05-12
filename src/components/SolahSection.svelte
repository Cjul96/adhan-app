<script lang="ts">
    import type { PrayerTimesResponse, Prayer } from "$lib/dto/dto";
    import { adhan } from "$lib/services/api";
    import AdhanCard from "./AdhanCard.svelte";
    export let lat: number;
    export let long: number;
    export let loading: boolean;
    let selectedMethod = "3";
    let prayerResponse: PrayerTimesResponse;
    export let prayerList: Prayer[];
    export let hijriDate:string;
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
                    img: "fajr.png",
                },
                {
                    name: "Sunrise",
                    time: timings.Sunrise,
                    isNext: false,
                    notified: false,
                    img: "sunrise.png",
                },
                {
                    name: "Dhuhr",
                    time: timings.Dhuhr,
                    isNext: false,
                    notified: false,
                    img: "dhuhr.png",
                },
                {
                    name: "Asr",
                    time: timings.Asr,
                    isNext: false,
                    notified: false,
                    img: "asr.png",
                },
                {
                    name: "Maghrib",
                    time: timings.Maghrib,
                    isNext: false,
                    notified: false,
                    img: "maghrib.png",
                },
                {
                    name: "Isha",
                    time: timings.Isha,
                    isNext: false,
                    notified: false,
                    img: "isya.png",
                },
            ];

            // Get hijri date
            hijriDate = `${prayerResponse.data.date.hijri.date.substring(0, 2)} ${prayerResponse.data.date.hijri.month.en} ${prayerResponse.data.date.hijri.year} ${prayerResponse.data.date.hijri.designation.abbreviated}`;
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
