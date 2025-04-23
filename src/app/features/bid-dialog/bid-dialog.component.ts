import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiService } from "../../core/services/api.service";
import { BidDto } from "../../core/models/bid.dto";
import { JobActiveDto } from "../../core/models/jobactivedto.model";

@Component({
  selector: "app-bid-dialog",
  templateUrl: "./bid-dialog.component.html",
  styleUrls: ["./bid-dialog.component.css"],
})
export class BidDialogComponent {
  bidForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<BidDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { job: JobActiveDto }
  ) {
    this.bidForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  submitBid() {
    if (this.bidForm.invalid) return;

    const bidderId = 1; /* recupera el ID del usuario logueado */
    const bid: BidDto = {
      jobId: this.data.job.id,
      bidderId,
      amount: this.bidForm.value.amount,
    };

    this.api.post<string>("Bid", bid).subscribe({
      next: () => {
        this.snackBar.open("¡Puja enviada con éxito!", "Cerrar", {
          duration: 3000,
        });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open("Error al enviar la puja.", "Cerrar", {
          duration: 3000,
        });
      },
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
