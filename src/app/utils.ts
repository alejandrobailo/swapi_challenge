import { utils } from 'protractor';

export function sortData(arrLabels, arrData) {
    let arrayOfObj = arrLabels.map((d, i) => {
        return {
            label: d,
            data: arrData[i] || 0
        };
    });

    let arrSorted = arrayOfObj.sort((a, b) => {
        return b.data > a.data;
    });

    let newArrayLabel = [];
    let newArrayData = [];

    arrSorted.forEach((d) => {
        newArrayLabel.push(d.label);
        newArrayData.push(d.data);
    });

    return { newArrayData, newArrayLabel }
}

export const options = {
    legend: {
        display: false
    },
    tooltips: {
        position: 'center',
    },
    scales: {
        xAxes: [
            {
                display: true,
                gridLines: {
                    display: false
                }
            }
        ],
        yAxes: [
            {
                display: true,
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 1000,
                    stepSize: 100
                },
                gridLines: {
                    display: false
                }
            }
        ]
    }
}