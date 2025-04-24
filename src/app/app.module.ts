import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";

// Angular Material Modules
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";

// Flex Layout
import { FlexLayoutModule } from "@angular/flex-layout";

// Core
import { AppComponent } from "./app.component";
import { ErrorInterceptor } from "./core/interceptors/error.interceptor";

// Features
import { JobRecentComponent } from "./features/job-recent/job-recent.component";
import { JobActiveComponent } from "./features/job-active/job-active.component";
import { JobDetailComponent } from "./features/job-detail/job-detail.component";
import { BidDialogComponent } from "./features/bid-dialog/bid-dialog.component";

@NgModule({
  declarations: [
    AppComponent,
    JobRecentComponent,
    JobActiveComponent,
    JobDetailComponent,
    BidDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // <— Required for Angular Material animations
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule, // <— Enables reactive forms directives
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatDialogModule, // <— Dialog support
    MatFormFieldModule, // <— Form field support
    MatInputModule, // <— Input controls
    MatSnackBarModule, // <— Snackbar notifications
    FlexLayoutModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
