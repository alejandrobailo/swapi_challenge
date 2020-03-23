import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

import { Starship, Query } from '../types';
import { sortData, options } from '../utils'
import { Observable } from 'rxjs';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  starships: Observable<Starship[]>;
  arrStarships: Starship[];
  chart: Chart;
  /* PROPERTIES VARS */
  property: any;
  propertyId: string;
  properties: string[];
  crews: number[];
  costInCredits: number[];
  cargoCapacity: number[];
  hyperdriveRating: number[];
  length: number[];
  maxAtmospheringSpeed: number[];
  passengers: number[];

  constructor(private apollo: Apollo) {
  }

  ngOnInit() {
    this.starships = this.apollo.watchQuery<Query>({
      query: gql`
        query allStarships {
          allStarships{
            name
            crew
            costInCredits
            cargoCapacity
            hyperdriveRating
            length
            maxAtmospheringSpeed
            passengers
          }
        }
      `
    })
      .valueChanges
      .pipe(
        map(result => result.data.allStarships)
      );

    /* Subscribe to obs */
    this.starships.subscribe((data) => {
      this.arrStarships = data;
      this.properties = this.arrStarships.map(item => item.name);
      this.crews = this.arrStarships.map(item => item.crew) //.sort((a, b) => b - a);
      this.costInCredits = this.arrStarships.map(item => item.costInCredits);
      this.cargoCapacity = this.arrStarships.map(item => item.cargoCapacity);
      this.hyperdriveRating = this.arrStarships.map(item => item.hyperdriveRating);
      this.length = this.arrStarships.map(item => item.length);
      this.maxAtmospheringSpeed = this.arrStarships.map(item => item.maxAtmospheringSpeed);
      this.passengers = this.arrStarships.map(item => item.passengers);

      /* Edit tooltip */
      Chart.Tooltip.positioners.center = function (elements) {
        const { x, y, base } = elements[0]._model;
        const height = base - y;
        return { x, y: y + height };
      };

      /* Chart ini */
      this.chart = new Chart("canvas", {
        type: "bar",
        data: {
          labels: this.properties,
          datasets: [
            {
              label: "Quantity",
              data: [],
              backgroundColor: '#93deff',
              fill: false
            },
          ]
        },
        options: options
      });
    });

  }

  updateChart(e) {
    if (document.querySelector('.hidden') != null) {
      document.querySelector('.hidden').classList.remove('hidden');
    }
    document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'));
    document.getElementById(e).classList.add('active');

    switch (e) {
      case 'crews':
        this.chart.data.datasets[0].data = sortData(this.properties, this.crews).newArrayData;
        this.chart.data.labels = sortData(this.properties, this.crews).newArrayLabel;
        this.chart.options.scales.yAxes[0].ticks.max = Math.max.apply(null, this.crews) / 1000
        this.chart.options.scales.yAxes[0].ticks.stepSize = Math.max.apply(null, this.crews) / 10000
        break;
      case 'costInCredits':
        this.chart.data.datasets[0].data = sortData(this.properties, this.costInCredits).newArrayData;
        this.chart.data.labels = sortData(this.properties, this.costInCredits).newArrayLabel;
        this.chart.options.scales.yAxes[0].ticks.max = Math.max.apply(null, this.costInCredits) / 10000
        this.chart.options.scales.yAxes[0].ticks.stepSize = Math.max.apply(null, this.costInCredits) / 100000
        break;
      case 'length':
        this.chart.data.datasets[0].data = sortData(this.properties, this.length).newArrayData;
        this.chart.data.labels = sortData(this.properties, this.length).newArrayLabel;
        this.chart.options.scales.yAxes[0].ticks.max = Math.max.apply(null, this.length) / 50
        this.chart.options.scales.yAxes[0].ticks.stepSize = Math.max.apply(null, this.length) / 500
        break;
      case 'cargoCapacity':
        this.chart.data.datasets[0].data = sortData(this.properties, this.cargoCapacity).newArrayData;
        this.chart.data.labels = sortData(this.properties, this.cargoCapacity).newArrayLabel;
        this.chart.options.scales.yAxes[0].ticks.max = Math.max.apply(null, this.cargoCapacity) / 10000000
        this.chart.options.scales.yAxes[0].ticks.stepSize = Math.max.apply(null, this.cargoCapacity) / 100000000
        break;
      case 'hyperdriveRating':
        this.chart.data.datasets[0].data = sortData(this.properties, this.hyperdriveRating).newArrayData;
        this.chart.data.labels = sortData(this.properties, this.hyperdriveRating).newArrayLabel;
        this.chart.options.scales.yAxes[0].ticks.max = Math.max.apply(null, this.hyperdriveRating)
        this.chart.options.scales.yAxes[0].ticks.stepSize = Math.max.apply(null, this.hyperdriveRating) / 10
        break;
      case 'maxAtmospheringSpeed':
        this.chart.data.datasets[0].data = sortData(this.properties, this.maxAtmospheringSpeed).newArrayData;
        this.chart.data.labels = sortData(this.properties, this.maxAtmospheringSpeed).newArrayLabel;
        this.chart.options.scales.yAxes[0].ticks.max = Math.max.apply(null, this.maxAtmospheringSpeed)
        this.chart.options.scales.yAxes[0].ticks.stepSize = Math.max.apply(null, this.maxAtmospheringSpeed) / 10
        break;
      case 'passengers':
        this.chart.data.datasets[0].data = sortData(this.properties, this.passengers).newArrayData;
        this.chart.data.labels = sortData(this.properties, this.passengers).newArrayLabel;
        this.chart.options.scales.yAxes[0].ticks.max = Math.round(Math.max.apply(null, this.passengers) / 10000)
        this.chart.options.scales.yAxes[0].ticks.stepSize = Math.round(Math.max.apply(null, this.passengers) / 100000)
        break;
    }
    this.chart.update();
  }

}
