const fs = require('fs');

const data = require('./inputFile');
const uniqueDates = [...new Set(data.map(({ timestamps }) => timestamps.startTime.split('T')[0]))];

const result = uniqueDates.map(date => {
    const bpmArray = data.filter(({ timestamps }) => timestamps.startTime.startsWith(date)).map(({ beatsPerMinute }) => beatsPerMinute);
    const min = Math.min(...bpmArray);
    const max = Math.max(...bpmArray);
    const latestDataTimestamp = new Date(Math.max(...data.filter(({ timestamps }) => timestamps.startTime.startsWith(date)).map(({ timestamps }) => new Date(timestamps.startTime)).map(date => date.getTime())));
    return {
        date,
        min,
        max,
        median: calculateMedian(bpmArray),
        latestDataTimestamp: latestDataTimestamp.toISOString()
    };
});

const outputFilePath = 'output.json';

fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2));

console.log(`Output shared to ${outputFilePath}`);

function calculateMedian(array) {
    const sortedArray = array.slice().sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedArray.length / 2);
    return sortedArray.length % 2 === 0
        ? (sortedArray[middleIndex - 1] + sortedArray[middleIndex]) / 2
        : sortedArray[middleIndex];
}
