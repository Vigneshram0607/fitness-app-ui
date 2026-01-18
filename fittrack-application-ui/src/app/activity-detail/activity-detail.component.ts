import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

import { ApiService } from '../services/api.service';
import { ActivityDetail } from './activity-detail.model';

interface Suggestion {
  title: string;
  description: string;
}

interface ParsedRecommendation {
  overall: string;
  pace: string;
  heartRate: string;
  caloriesBurned: string;
}

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './activity-detail.component.html',
  styleUrl: './activity-detail.component.scss'
})
export class ActivityDetailComponent implements OnInit {
  activity$!: Observable<ActivityDetail>;
  suggestions$!: Observable<Suggestion[]>;
  parsedRecommendation$!: Observable<ParsedRecommendation>;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    const activityId = this.route.snapshot.paramMap.get('activityId');
    if (activityId) {
      this.activity$ = this.apiService.getActivityDetail(activityId).pipe(
        shareReplay(1)
      );
      this.suggestions$ = this.activity$.pipe(
        map(activity => this.parseSuggestions(activity.suggestions))
      );
      this.parsedRecommendation$ = this.activity$.pipe(
        map(activity => this.parseRecommendation(activity.recommendation))
      );
    }
  }

  parseSuggestions(suggestions: string[]): Suggestion[] {
    return suggestions.map(suggestion => {
      const parts = suggestion.split(':');
      if (parts.length > 1) {
        return {
          title: parts[0].trim(),
          description: parts.slice(1).join(':').trim()
        };
      }
      return {
        title: 'Suggestion',
        description: suggestion
      };
    });
  }

  parseRecommendation(recommendation: string): ParsedRecommendation {
    const overall = recommendation.match(/Overall:(.*?)(Pace:|$)/s);
    const pace = recommendation.match(/Pace:(.*?)(Heart Rate:|$)/s);
    const heartRate = recommendation.match(/Heart Rate:(.*?)(Calories Burned:|$)/s);
    const caloriesBurned = recommendation.match(/Calories Burned:(.*)/s);

    return {
      overall: overall ? overall[1].trim() : 'N/A',
      pace: pace ? pace[1].trim() : 'N/A',
      heartRate: heartRate ? heartRate[1].trim() : 'N/A',
      caloriesBurned: caloriesBurned ? caloriesBurned[1].trim() : 'N/A'
    };
  }

  getIconForActivity(activityType: string): string {
    switch (activityType.toUpperCase()) {
      case 'RUNNING':
        return 'fa-person-running';
      case 'CYCLING':
        return 'fa-bicycle';
      case 'YOGA':
        return 'fa-spa';
      case 'SWIMMING':
        return 'fa-person-swimming';
      default:
        return 'fa-heart-pulse';
    }
  }
}
