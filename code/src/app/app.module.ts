import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { CellComponent } from './cell/cell.component';
import { HttpClientModule } from '@angular/common/http';
import { WordMeaningComponent } from './word-meaning/word-meaning.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    CellComponent,
    WordMeaningComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
