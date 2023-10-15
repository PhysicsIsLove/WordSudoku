import { Component, Input, OnInit } from '@angular/core';
import { WordMeaning } from '../model';

@Component({
  selector: 'app-word-meaning',
  templateUrl: './word-meaning.component.html',
  styleUrls: ['./word-meaning.component.scss']
})
export class WordMeaningComponent implements OnInit {

  @Input("wordMeaning") wordMeaning!: WordMeaning;

  constructor() { }

  ngOnInit(): void {
  }

}
