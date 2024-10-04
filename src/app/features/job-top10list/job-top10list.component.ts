import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { JobTop10Dto } from '../../core/models/jobtop10dto.model';

@Component({
  selector: 'app-job-top10list',
  templateUrl: './job-top10list.component.html',
  styleUrl: './job-top10list.component.css'
})
export class JobTop10listComponent implements OnInit{
  jobs: JobTop10Dto[] = [];
  isLoading: boolean = true; 
  hasError: boolean = false;
  trackByJob(index: number, job: JobTop10Dto): number {
    return job.id;
  }

  constructor(private apiService: ApiService){}

  ngOnInit(): void {
    this.fetchJobs();
  }

  fetchJobs(): void {
    this.isLoading = true;  // Set loading to true when fetching data
    this.apiService.get<JobTop10Dto[]>('Job').subscribe({
      next: (data: JobTop10Dto[]) => {
        this.jobs = data;
        this.isLoading = false;  // Set loading to false when data is fetched
      },
      error: (error) => {
        console.error('Error fetching the top 10 recent jobs', error);
        this.hasError = true;  // Set error state to true if there's an error
        this.isLoading = false;  // Set loading to false if there's an error
      }
    });
  }
}