import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { Starship, Query } from '../types';
import { options, updateData } from '../utils'
import { Observable } from 'rxjs';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() close: boolean
  starships: Observable<Starship[]>;
  arrStarships: Starship[];
  chart: Chart;
  closeBtn: any;
  /* Property vars */
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
    this.closeBtn = document.getElementById('closeBtn').style;
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
      this.crews = this.arrStarships.map(item => item.crew);
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
    this.close = false;

    if (document.querySelector('.hidden') != null && !this.close) {
      document.querySelector('#hidden').classList.remove('hidden');
    }

    document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'));
    document.getElementById(e).classList.add('active');

    setTimeout(() => {
      if (document.querySelector('.hiddenCanva') != null && !this.close) {
        document.querySelector('#hiddenCanva').classList.remove('hiddenCanva');
      }
    }, 800)

    this.closeBtn.color = "#aaa";
    this.closeBtn.cursor = "pointer";

    switch (e) {
      case 'crews':
        updateData(this.chart, this.properties, this.crews, 1000, 10000);
        break;
      case 'costInCredits':
        updateData(this.chart, this.properties, this.costInCredits, 10000, 100000);
        break;
      case 'length':
        updateData(this.chart, this.properties, this.length, 50, 500);
        break;
      case 'cargoCapacity':
        updateData(this.chart, this.properties, this.cargoCapacity, 10000000, 100000000);
        break;
      case 'hyperdriveRating':
        updateData(this.chart, this.properties, this.hyperdriveRating, 1, 10);
        break;
      case 'maxAtmospheringSpeed':
        updateData(this.chart, this.properties, this.maxAtmospheringSpeed, 1, 10);
        break;
      case 'passengers':
        updateData(this.chart, this.properties, this.passengers, 10000, 100000);
        break;
    }

    this.chart.update();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.close == true || changes.close.previousValue == true) {
      document.querySelector('#hidden').classList.add('hidden');
      document.querySelector('#hiddenCanva').classList.add('hiddenCanva');
      this.closeBtn.color = "#323643";
      this.closeBtn.cursor = "default";
    }
  }
}
