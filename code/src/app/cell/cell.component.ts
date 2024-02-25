import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Cell } from '../model';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

  isActive = false;
  yoyo: string = `linear-gradient(90deg, rgba(255,137,90,1) 0%, rgba(255,148,106,1) 100%)`
  @Input("cellInfo") cellInfo :Cell = {row: -1, col: -1, letter: "", isActive: false, isLocked: false, background:""};
  @Output() cellValueChange = new EventEmitter<string>();
  @Output() cellClick = new EventEmitter<{row: number, col: number}>();

  @ViewChild("cellInput") cellInput!: ElementRef;

  previousValue: string = "";

  constructor() { 
  }

  ngOnInit(): void {
  }

  // onKeyPress(event: any){
  //   console.log("Event is ", event);
  //   if(!this.cellInfo.isActive){
  //     event.preventDefault();
  //     return;
  //   }
  //   let keyCode: string = event.code;
  //   if((keyCode === "Backspace" || keyCode === "Delete") && this.cellInfo.letter != ""){
  //     this.cellValueChange.emit("");
  //   } else{
  //     let letter: string = keyCode.substring(3, 4);
  //     console.log("Letter is ", letter);
  //     if(letter >= "A" && letter <= "Z"){
  //       if(letter !== this.cellInfo.letter){
  //         console.log("Emitting ", letter);
  //         this.cellValueChange.emit(letter);
  //       }        
  //     } else{
  //       console.log("preventing default ");
  //       event.preventDefault();
  //     }
  //   }        
  // }

  onClickInput(){
    this.cellClick.emit({row: this.cellInfo.row, col: this.cellInfo.col});
    this.cellInput.nativeElement.setSelectionRange(this.cellInput.nativeElement.value.length, this.cellInput.nativeElement.value.length);
    // so that the cursor always is at the end of the input text
  }

  onInputEvent(event: any){
    console.log("Inside the input event");
    if(!this.cellInfo.isActive){      
      this.cellInfo.letter = this.previousValue;
      this.cellInput.nativeElement.value = this.previousValue;
      console.log("Cell was inactive, hence returning ");
      return;
    }

    console.log("this.cellInfo.letter ", this.cellInfo.letter);
    let inputText = this.cellInfo.letter || '';
    inputText = inputText.toUpperCase();
    inputText = inputText.charAt(inputText.length - 1); // Keep only the last character
    
    this.cellInput.nativeElement.value = inputText;
    this.cellInfo.letter = inputText;
    this.previousValue = inputText;
    this.cellValueChange.emit(inputText);
    console.log("inputText ", inputText);
    console.log("At the end of the fnction");
  }

}
