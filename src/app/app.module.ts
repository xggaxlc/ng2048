import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LocalStorageService, SessionStorageService } from './services/storage.service';
import { AlertService } from './services/alert.service';

import { AppComponent } from './app.component';
import { BoxSquareDirective } from './directives/box-square.directive';

@NgModule({
  declarations: [
    AppComponent,
    BoxSquareDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    AlertService,
    LocalStorageService,
    SessionStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
