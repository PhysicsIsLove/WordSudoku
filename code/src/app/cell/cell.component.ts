import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cell } from '../model';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

  isActive = false;
  yoyo: string = `linear-gradient(90deg, rgba(255,137,90,1) 0%, rgba(255,148,106,1) 100%)`
  @Input("cellInfo") cellInfo :Cell = {letter: "", isActive: false, isLocked: false, background:""};
  @Output() cellValueChange = new EventEmitter<string>();

  constructor() { 
    // remove the input box from ThisReceiver, keep only dispatchEvent, if the user enters any alphabet then change the content of that div
  }

  ngOnInit(): void {
  }

  onKeyPress(event: any){
    if(!this.cellInfo.isActive){
      return;
    }
    let keyCode: string = event.code;
    if(keyCode === "Backspace" && this.cellInfo.letter != ""){
      this.cellValueChange.emit("");
    } else{
      let letter: string = keyCode.substring(3, 4);
      if(letter >= "A" && letter <= "Z"){
        if(letter !== this.cellInfo.letter){
          this.cellValueChange.emit(letter);
        }        
      }
    }        
  }
}
