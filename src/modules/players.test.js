const { getChartData } = require('./players');

describe('getChartData (live integration)', () => {
    // This test hits the live Rolimons website, so allow more time
    jest.setTimeout(15000); // 15 seconds

    it('should fetch real chart data for a valid user ID', async () => {
        const data = await getChartData(1517579);
        console.log('Returned chart data:', JSON.stringify(data, null, 2)); // 👈 add this line

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');

        expect(data).toHaveProperty('chart_data');
        expect(data.chart_data).toHaveProperty('nominal_scan_time');
        expect(data.chart_data).toHaveProperty('value');
        expect(data.chart_data).toHaveProperty('rap');
        expect(data.chart_data).toHaveProperty('num_limiteds');
        expect(data.chart_data).toHaveProperty('num_points');

        expect(Array.isArray(data.chart_data.nominal_scan_time)).toBe(true);
        expect(Array.isArray(data.chart_data.value)).toBe(true);
        expect(Array.isArray(data.chart_data.rap)).toBe(true);
        expect(Array.isArray(data.chart_data.num_limiteds)).toBe(true);
        expect(typeof data.chart_data.num_points).toBe('number');

        // Optional: Validate that arrays have the same length
        const length = data.chart_data.nominal_scan_time.length;
        expect(data.chart_data.value.length).toBe(length);
        expect(data.chart_data.rap.length).toBe(length);
        expect(data.chart_data.num_limiteds.length).toBe(length);
    });

    it('should return an empty object for an invalid user ID', async () => {
        const data = await getChartData(0); // Likely invalid user ID
        expect(data).toEqual({});
    });
});
