<template>
  <!-- Chart Section -->
  <div class="card shadow-sm border-0 rounded-4 mb-4 p-4">
    <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
      <h2 class="h5 mb-0">Products Sell Analysis</h2>
      <div class="d-flex align-items-center gap-2">
        <select
          v-if="yearOptions && yearOptions.length"
          v-model="selectedYear"
          class="form-select form-select-sm border-0 bg-white fw-semibold text-secondary"
          style="width: 110px"
        >
          <option v-for="year in yearOptions" :key="year" :value="year">
            {{ year === currentYear ? 'This Year' : year }}
          </option>
        </select>
        <select
          v-if="typeOptions && typeOptions.length"
          v-model="selectedType"
          class="form-select form-select-sm border-0 bg-white fw-semibold text-secondary"
          style="width: 90px"
        >
          <option v-for="t in typeOptions" :key="t" :value="t">
            {{ typeof t === 'string' ? t.charAt(0).toUpperCase() + t.slice(1) : t }}
          </option>
        </select>
      </div>
    </div>
    <apexchart :type="selectedType" height="280" :options="chartOptions" :series="chartSeries" />
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import ApexCharts from 'vue3-apexcharts'
export default {
  name: 'AdminChartComponent',
  components: { apexchart: ApexCharts },
  props: {
    dataset: {
      type: Array as () => Array<{ year: number; categories: string[]; sales: number[] }>,
      required: true,
    },
  },
  setup(props) {
    const currentYear = new Date().getFullYear()
    // Dynamically generate year options from dataset array, sorted descending
    const yearOptions = computed(() => {
      return (props.dataset as Array<{ year: number }>)
        .map((item) => item.year)
        .sort((a, b) => b - a)
    })
    const typeOptions = ['bar', 'line']
    const selectedYear = ref<number>(yearOptions.value[0] ?? currentYear)
    const selectedType = ref<'bar' | 'line'>(typeOptions[0] as 'bar' | 'line')

    const getDataByYear = (year: number) =>
      (props.dataset as Array<{ year: number; categories: string[]; sales: number[] }>).find(
        (item) => item.year === year,
      )

    const chartOptions = computed(() => {
      const selected = Number(selectedYear.value)
      const data = getDataByYear(selected)
      const categories = data?.categories || []
      if (selectedType.value === 'line') {
        return {
          chart: { type: 'line' as const, toolbar: { show: false } },
          stroke: { curve: 'smooth' as const, width: 3, colors: ['#6366f1', '#f59e42', '#10b981'] },
          markers: { size: 5 },
          dataLabels: { enabled: false },
          xaxis: { categories },
          yaxis: { title: { text: 'Sales' } },
          colors: ['#6366f1', '#f59e42', '#10b981'],
          legend: { position: 'top' as const },
          tooltip: { y: { formatter: (val: number) => `${val} items` } },
          grid: { borderColor: '#f2f2f2' },
        }
      } else {
        return {
          chart: { type: 'bar' as const, toolbar: { show: false } },
          plotOptions: {
            bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' },
          },
          dataLabels: { enabled: false },
          stroke: { show: true, width: 2, colors: ['transparent'] },
          xaxis: { categories },
          yaxis: { title: { text: 'Sales' } },
          fill: { opacity: 1 },
          tooltip: { y: { formatter: (val: number) => `${val} items` } },
          colors: ['#6366f1', '#f59e42', '#10b981'],
          legend: { position: 'top' as const },
          grid: { borderColor: '#f2f2f2' },
        }
      }
    })

    const chartSeries = computed(() => {
      const selected = Number(selectedYear.value)
      const prev = selected - 1
      const selectedData = getDataByYear(selected)
      const prevData = getDataByYear(prev)
      return [
        {
          name: `${selected}`,
          data: selectedData?.sales || [],
        },
        {
          name: `${prev}`,
          data: prevData?.sales || [],
        },
      ]
    })

    return {
      currentYear,
      yearOptions,
      typeOptions,
      selectedYear,
      selectedType,
      chartOptions,
      chartSeries,
    }
  },
}
</script>
