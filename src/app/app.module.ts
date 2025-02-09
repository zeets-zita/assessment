import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from "@angular/common/http";
import { DashboardComponent } from './dashboard/dashboard.component';
import { ButtonModule } from "primeng/button";
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SelectButtonModule } from 'primeng/selectbutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DividerModule } from 'primeng/divider';
import {DatePipe} from "@angular/common";
import {DragDropModule} from "primeng/dragdrop";
import {StepsModule} from "primeng/steps";
import {MenubarModule} from "primeng/menubar";


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    SelectButtonModule,
    OverlayPanelModule,
    DividerModule,
    DragDropModule,
    StepsModule,
    MenubarModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
