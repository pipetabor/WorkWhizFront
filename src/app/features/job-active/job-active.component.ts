import { Component, OnDestroy, OnInit } from "@angular/core";
import { SignalRService } from "../../core/services/signalr.service";
import { ApiService } from "../../core/services/api.service";
import { JobActiveDto } from "../../core/models/jobactivedto.model";
import { MatDialog } from "@angular/material/dialog";
import { BidDialogComponent } from "../bid-dialog/bid-dialog.component";

@Component({
  selector: "app-job-active",
  templateUrl: "./job-active.component.html",
  styleUrls: ["./job-active.component.css"],
})
export class JobActiveComponent implements OnInit, OnDestroy {
  jobs: JobActiveDto[] = [];
  isLoading = true;
  hasError = false;
  private connection: any;

  constructor(
    private apiService: ApiService,
    private signalRService: SignalRService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchJobs();
    this.connectToSignalR();
  }

  ngOnDestroy(): void {
    this.disconnectFromSignalR();
  }

  fetchJobs(): void {
    this.isLoading = true;
    this.apiService.get<JobActiveDto[]>("Job/top-active").subscribe({
      next: (data: JobActiveDto[]) => {
        this.jobs = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error fetching the top active jobs", error);
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  openBidDialog(job: JobActiveDto) {
    const dialogRef = this.dialog.open(BidDialogComponent, {
      width: "400px",
      data: { job },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) this.fetchJobs();
    });
  }

  private connectToSignalR(): void {
    this.signalRService
      .connect()
      .then((connection) => {
        this.connection = connection;
        this.connection.on(
          "ReceiveUpdatedJobs",
          (updatedJobs: JobActiveDto[]) => {
            this.jobs = updatedJobs;
          }
        );
      })
      .catch((error) => console.error("Error connecting to SignalR", error));
  }

  private disconnectFromSignalR(): void {
    if (this.connection) {
      this.connection.stop();
    }
  }
}
