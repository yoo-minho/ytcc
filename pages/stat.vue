<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { LineChart } from '@/components/ui/chart-line'

interface AnalyticsRow {
    dimensionValues: { value: string }[];
    metricValues: { value: string }[];
}

interface AnalyticsData {
    rows?: AnalyticsRow[];
}

interface ChartData {
    date: string;
    teamlog: number;
    ytcc: number;
    customcol: number;
    cutin: number;
}

const analyticsData = ref<{ [key: string]: AnalyticsData | null }>({
    teamlog: null,
    ytcc: null,
    customcol: null,
    cutin: null
});
const isLoading = ref(true);
const chartData = ref<ChartData[]>([]);

const colors = [
    "#2E3440", // 노션 다크 모드의 진한 회색
    "#5E81AC", // 차분한 파란색
    "#A3BE8C", // 부드러운 녹색
    "#B48EAD", // 세련된 보라색
];

onMounted(async () => {
    try {
        const services = ['teamlog', 'ytcc', 'customcol', 'cutin'];
        const responses = await Promise.all(
            services.map(service => fetch(`/api/ga?type=${service}`))
        );
        const data = await Promise.all(
            responses.map(response => response.json())
        );

        services.forEach((service, index) => {
            analyticsData.value[service] = data[index];
        });

        if (analyticsData.value.teamlog?.rows) {
            chartData.value = analyticsData.value.teamlog.rows.map(row => {
                const date = row.dimensionValues[0].value;
                return {
                    date,
                    teamlog: parseInt(row.metricValues[0].value),
                    ytcc: parseInt(analyticsData.value.ytcc?.rows?.find(r => r.dimensionValues[0].value === date)?.metricValues[0].value || '0'),
                    customcol: parseInt(analyticsData.value.customcol?.rows?.find(r => r.dimensionValues[0].value === date)?.metricValues[0].value || '0'),
                    cutin: parseInt(analyticsData.value.cutin?.rows?.find(r => r.dimensionValues[0].value === date)?.metricValues[0].value || '0')
                };
            });
        }
    } catch (error) {
        console.error('Error fetching analytics data:', error);
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <CardHeader>
        <CardTitle>MAU</CardTitle>
        <CardDescription>Monthly Active User</CardDescription>
    </CardHeader>

    <CardContent>
        <div v-if="isLoading" class="flex items-center justify-center h-[200px]">
            <div class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span class="text-sm text-muted-foreground">데이터를 불러오는 중...</span>
            </div>
        </div>

        <div v-else-if="analyticsData.teamlog?.rows" class="space-y-6">
            <div class="w-full">
                <LineChart :data="chartData" index="date" :categories="['teamlog', 'ytcc', 'customcol', 'cutin']"
                    :colors="colors" :x-formatter="(_, i) => {
                        const date = chartData[i].date;
                        return `${date}`;
                    }" :y-formatter="(tick) => {
                        return typeof tick === 'number'
                            ? new Intl.NumberFormat('ko-KR').format(tick)
                            : ''
                    }" />
            </div>
        </div>

        <div v-else class="flex items-center justify-center h-[400px]">
            <p class="text-sm text-muted-foreground">데이터가 없습니다.</p>
        </div>
    </CardContent>
</template>

<style scoped></style>