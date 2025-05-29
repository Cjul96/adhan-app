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

<div class=" w-full text-center {prayer.isNow? 'text-green-200 text-shadow-lg text-shadow-green-500': ''} ">
    <svg
        class=" w-1/2 m-auto "
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d={prayer.icon} fill="currentColor" />
    </svg>
    <h6>{prayer.name}</h6>
    <span>{formatTime(prayer.time)}</span>
</div>
