import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WordMeaning } from '../model';

@Component({
  selector: 'app-word-meaning',
  templateUrl: './word-meaning.component.html',
  styleUrls: ['./word-meaning.component.scss']
})
export class WordMeaningComponent implements OnInit {

  @Input("wordMeaning") wordMeaning!: WordMeaning | null;
  @Output("closeModal") closeModal = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onClickCloseModal(){
    this.closeModal.emit();
  }

}
