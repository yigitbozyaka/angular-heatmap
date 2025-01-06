import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import $ from 'jquery';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { HeroService } from './hero.service';

type Feedback = {
  trackingNum: string | undefined;
  name: string | undefined;
  surname: string | undefined;
  email: string | undefined;
  tel: string | undefined;
  rating: number | undefined;
  message: string | undefined;
  province: string;
  district: string;
}

type LocationRating = {
  total: number;
  count: number;
  average: number;
}

@Component({
  selector: 'app-hero',
  imports: [MatIconModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class HeroComponent implements AfterViewInit {
  public feedbacks: Feedback[] = [];
  private locationRatings: Map<string, LocationRating> = new Map();

  constructor(private HeroService: HeroService) {
    this.HeroService?.fetchFeedbacks().subscribe((feedbacks: any) => {
      this.feedbacks = feedbacks as Feedback[];
      this.calculateAverageRatings();
      this.initMap();
    });
  }

  ngAfterViewInit(): void {}

  private calculateAverageRatings(): void {
    this.locationRatings.clear();
    
    this.feedbacks.forEach(feedback => {
      if (feedback.rating && feedback.province && feedback.district) {
        const locationKey = `${feedback.province} ${feedback.district}`;
        const currentRating = this.locationRatings.get(locationKey) || { total: 0, count: 0, average: 0 };
        
        currentRating.total += feedback.rating;
        currentRating.count += 1;
        currentRating.average = currentRating.total / currentRating.count;
        
        this.locationRatings.set(locationKey, currentRating);
      }
    });
  }

  private getRatingColor(rating: number): string {
    if (rating >= 4) return 'green';
    if (rating >= 3) return 'orange';
    return 'red';
  }

  private applyCustomColors(): void {
    this.locationRatings.forEach((rating, location) => {
      const [province, district] = location.split(' ');
      const selector = `#turkey #${province} #${district} #Shape`;
      const color = this.getRatingColor(rating.average);
      $(selector).css('fill', color);
    });
  }

  private initMap(): void {
    $.get('/turkey-demo.svg', (data) => {
      $('#turkey-map').append('<div class="map-container">' + data + '</div>');
      $('.map-container').append('<div class="map-title"><span class="map-close"></span><strong></strong></div>');

      $('#turkey-map[data-bg-color]').css('background-color', $('#turkey-map').attr('data-bg-color')!);
      $('#turkey-map[data-map-color] #turkey > g > g > polygon, #turkey-map[data-map-color] #turkey > g > g > g, #turkey-map[data-map-color] #turkey > g > g > path').css('fill', $('#turkey-map').attr('data-map-color')!);

      this.applyCustomColors();

      $.each($('#turkey > g'), (index, val) => {
        const e = $(val)[0].getBoundingClientRect();
        const trMapL = $('#turkey-map').offset()!.left;
        const trMapT = $('#turkey-map').offset()!.top;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        const trL = ($('#turkey-map').width()! / 2) - ((e.left - trMapL + scrollX) + (e.width / 2));
        const trT = ($('#turkey-map').height()! / 2) - ((e.top - trMapT + scrollY) + (e.height / 2));

        $(val).attr('data-transform-left', trL);
        $(val).attr('data-transform-top', trT);
      });
      $('#turkey-map').append('<div class="map-tooltip"></div>');

      $.each($('#turkey-map color'), (index, val) => {
        const id = $(val).attr('id');
        $('#' + id + ' polygon, ' + ' #' + id + ' path, ' + ' #' + id + ' g').addClass($(val).attr('data-color')!);
      });

      this.addEventListeners();
    }, 'html');
  }

  private addEventListeners(): void {
    let mapContainer = $('#turkey-map');
    let tooltip = $('.map-tooltip');

    $(document).on({
      mouseenter: function (e) {
        const mapType = $('#turkey-map').attr('data-map') === 'districts'
          ? $(this)
          : $('#turkey-map').attr('data-map') === 'city'
            ? $(this).parent('g')
            : $(this).parent('g');

        const rect = this.getBoundingClientRect();

        const centerX = rect.left + (rect.width / 2);
        const centerY = rect.top + (rect.height / 2);

        const mapOffset = mapContainer.offset()!;

        tooltip.html('<span>' + mapType.parent('g').attr('id') + '</span> ' + mapType.attr('id'));

        const tooltipWidth = tooltip.outerWidth(true)!;
        const tooltipHeight = tooltip.outerHeight(true)!;

        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        const tooltipX = centerX + scrollX - mapOffset.left - (tooltipWidth / 2);
        const tooltipY = centerY + scrollY - mapOffset.top - tooltipHeight - 620;

        tooltip.css({
          transform: `translate(${tooltipX}px, ${tooltipY}px)`,
          opacity: 1
        }).addClass('hovered');
      },
      mouseleave: function () {
        tooltip.removeClass('hovered').css('opacity', 0);
      },
      click: function () {
        $('#turkey-map svg g').removeClass('selected');
        $(this).parent('g').addClass('selected');
        $('#turkey-map svg').css({
          transform: 'scale(3) translate(' + $(this).parent('g').attr('data-transform-left') + 'px, ' + $(this).parent('g').attr('data-transform-top') + 'px)',
        }).parents('#turkey-map').addClass('zoomed');
        $('#turkey-map .map-title strong').text($(this).parent('g').attr('id')!);
      },
    }, '#turkey > g > g');

    $(document).on('click', '#turkey-map .map-title .map-close', () => {
      $('#turkey-map svg').css({
        transform: 'scale(1) translate(0, 0)',
      }).parents('#turkey-map').removeClass('zoomed');
    });
  }
}