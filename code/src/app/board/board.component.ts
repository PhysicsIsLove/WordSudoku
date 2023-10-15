import { Component, OnInit } from '@angular/core';
import { BOARD_SIZE, CELL_COLOR, FAILURE_INFO, GRADIENT, INITIALIZING_WORD, WORDS_FILE_PATH } from '../constants';
import { Cell, WordMeaning, WordValidation } from '../model';
import { FileServiceService } from '../services/file-service.service';
import { DictionaryService } from '../services/dictionary.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  board: Cell[][] = [];

  foundWord: string = "";
  foundMeaning: string = "";

  failureDetail: string = "";
  failureReason: string = "";

  gridSize: string = `repeat(${BOARD_SIZE}, 1fr)`;

  solveStatus : string = "";

  ALL_WORDS: any;

  wordMeaning!: WordMeaning | null;

  constructor(private fileService: FileServiceService, private dictionaryService: DictionaryService) {
    this.initializeTheBoard();
   }

  ngOnInit(): void {
    this.loadWordsFile();
  }

  loadWordsFile() {
    const filePath = WORDS_FILE_PATH;
    this.fileService.getFileContent(filePath).subscribe(res => {
      this.ALL_WORDS = res.split("\r\n").sort();
    });
  }

  onCellClick(row: number, col: number){
    console.log("clicke inside the board component");
    for(let i=0; i< BOARD_SIZE; i++){
      for(let j=0; j< BOARD_SIZE; j++){
        if(!this.board[i][j].isLocked){
          if(row == i && col == j){
            this.board[i][j].isActive = !this.board[i][j].isActive;
          } else{
            this.board[i][j].isActive = false;          
          }          
        }      
      }
    }
  }

  initializeTheBoard(){
    this.board = [];
    this.failureDetail = "";
    this.failureReason = "";
    for(let i = 0; i < BOARD_SIZE; i++) {
      this.board.push([]);
      for(let j = 0; j< BOARD_SIZE; j++) {
          this.board[i].push({letter:"", isActive: false, isLocked: false, background:CELL_COLOR.INACTIVE_CELL});
      }
    }
    this.fillTheBoardWithAWord(INITIALIZING_WORD);
  }

  onCellValueChange(input: string, row: number, col: number){
    this.solveStatus = "";
    this.failureReason = "";
    this.setDefaultColors();
    this.board[row][col].letter = input;
    if(this.checkIfTheBoardIsFullyFilled(this.board)){
      if(this.checkIfTheBoardIsSolved(this.board)){
        this.solveStatus = "SUCCESS";
      } else{
        this.solveStatus = "TRY AGAIN";
      }
    }
  }

  checkIfTheBoardIsSolved(board: Cell[][]): boolean {
    for(let row=0; row<BOARD_SIZE; row++){
      for(let i=0; i<=BOARD_SIZE-3; i++){
        for(let j=i+3; j<=BOARD_SIZE; j++){
          let word: string = this.constructWordFromIndices(this.board, row, i, row, j);
          let validationStatus = this.validateWord(word)
          if(validationStatus.hasDuplicates){
            this.failureDetail = validationStatus.duplicateCharacter + " is repeated";
            this.failureReason = FAILURE_INFO.DUPLICATE;
            this.colorDuplicateCharacters(board, validationStatus.duplicateCharacter, row, true);
            return false;
          } else if (validationStatus.wordAlreadyExists){
              if(validationStatus.doesReverseExist){
                this.failureDetail = this.reverseWord(word.toUpperCase()) + " exists";
                this.failureReason = FAILURE_INFO.WORD_EXISTS;
                this.foundWord = this.reverseWord(word.toUpperCase());
                this.colorExistingWord(this.board, row, j, row, i);
              } else{
                this.failureDetail = word + " exists";
                this.failureReason = FAILURE_INFO.WORD_EXISTS;
                this.foundWord = word;
                this.colorExistingWord(this.board, row, i, row, j);
              }            
            return false;
          }
        }
      }
    }
    
    for(let col = 0; col< BOARD_SIZE; col++){
      for(let i=0; i<=BOARD_SIZE-3; i++){
        for(let j=i+3; j<=BOARD_SIZE; j++){
          let word: string = this.constructWordFromIndices(this.board, i, col, j, col);
          let validationStatus = this.validateWord(word)
          if(validationStatus.hasDuplicates){
            this.failureDetail = validationStatus.duplicateCharacter + " is repeated";
            this.failureReason = FAILURE_INFO.DUPLICATE;
            this.colorDuplicateCharacters(board, validationStatus.duplicateCharacter, col, false);
            return false;
          } else if (validationStatus.wordAlreadyExists){
            if(validationStatus.doesReverseExist){
              this.failureDetail = this.reverseWord(word.toUpperCase()) + " exists";
              this.failureReason = FAILURE_INFO.WORD_EXISTS;
              this.foundWord = this.reverseWord(word.toUpperCase());
              this.colorExistingWord(this.board, j, col, i, col);
            } else{
              this.failureDetail = word + " exists";
              this.failureReason = FAILURE_INFO.WORD_EXISTS;
              this.foundWord = word;
              this.colorExistingWord(this.board, i, col, j, col);
            }          
            return false;
          }
        }
      }
    }    
    this.failureReason = "";
    this.foundWord = "";
    return true;
  }

  colorDuplicateCharacters(board: Cell[][], char: string, index: number, isRow: boolean){
    if(isRow){
      for(let i=0; i< BOARD_SIZE; i++){
        if(board[index][i].letter === char && !board[index][i].isLocked){
          board[index][i].background = CELL_COLOR.DUPLICATE_CHAR_CELL;
        }        
      }
    } else{
      for(let i=0; i< BOARD_SIZE; i++){
        if(board[i][index].letter === char && !board[index][i].isLocked){
          board[i][index].background = CELL_COLOR.DUPLICATE_CHAR_CELL;
        }        
      }
    }
  }

  colorExistingWord(board: Cell[][],  startRow: number, startCol: number, endRow: number, endCol: number ){
    if(startRow == endRow){
      if(startCol < endCol){
        for(let i = startCol; i < endCol; i++){
          let colorKey = `leftToRight_${i-startCol}`;
          board[startRow][i].background = GRADIENT[colorKey];
        }
      } else{
        for(let i = startCol-1; i >= endCol; i--){
          let colorKey = `rightToLeft_${startCol - i - 1}`;
          board[startRow][i].background = GRADIENT[colorKey];
        }
      }      
    } else if (startCol == endCol){
      if(startRow < endRow){
        for(let i = startRow; i < endRow; i++){
          let colorKey = `topToBottom_${i-startRow}`;
          board[i][startCol].background = GRADIENT[colorKey];
        }
      } else{
        for(let i = startRow-1; i >= endRow; i--){
          let colorKey = `bottomToTop_${startRow - i - 1}`;
          board[i][startCol].background = GRADIENT[colorKey];
        }
      }
    }
  }

  constructWordFromIndices(board: Cell[][], startRow: number, startCol: number, endRow: number, endCol: number): string{
    let word: string = "";
    if(startRow == endRow){
      for(let i = startCol; i < endCol; i++){
        word += board[startRow][i].letter;
      }
    } else if (startCol == endCol){
      for(let i = startRow; i < endRow; i++){
        word += board[i][startCol].letter;
      }
    }
    console.log("(", startRow, startCol, ")", "->", "(", endRow, endCol, ")", word);
    return word;
  }


  checkIfTheBoardIsFullyFilled(board: Cell[][]): boolean{
    for(let row of board){
      for(let cell of row){
        if(cell.letter === ""){
          this.solveStatus = "";
          this.foundWord = "";
          return false;
        }
      }
    }
    return true;
  }

  wordAlreadyExists(word: string){
    word = word.toLowerCase();
    for(let w of this.ALL_WORDS){
      if(word === w) return true;
    }return false;
  }

  validateWord(word: string): WordValidation{
    let duplicateCharacter = this.hasDuplicateCharacters(word);
    if(duplicateCharacter != ""){
      return {hasDuplicates: true, wordAlreadyExists: false, duplicateCharacter: duplicateCharacter, doesReverseExist: false };
    } else if(this.wordAlreadyExists(word)){
      return {hasDuplicates: false, wordAlreadyExists: true, duplicateCharacter: "", doesReverseExist: false};
    } else if (this.wordAlreadyExists(this.reverseWord(word))){
      return {hasDuplicates: false, wordAlreadyExists: true, duplicateCharacter: "", doesReverseExist: true};
    }
    return {hasDuplicates: false, wordAlreadyExists: false, duplicateCharacter:"", doesReverseExist: false};
  }

  /**
   * If the word contains duplicate characters, then it returns the character, else returns an empty string
   * @param word 
   * @returns 
   */
  hasDuplicateCharacters(word: string): string {
    const charSet = new Set();  
    for (const char of word) {
      if (charSet.has(char)) {
        return char;
      }
      charSet.add(char);    
    }  
    return "";
  }

  fillTheBoardWithAWord(word: string){
    let lastCol = -1;
    let index = 0;
    for(let i = 0; i< BOARD_SIZE; i++){
      let randomCol = this.generateARandomNumber(0, BOARD_SIZE-1);
      while(randomCol == lastCol){
        randomCol = this.generateARandomNumber(0, BOARD_SIZE-1);
      }
      this.board[i][randomCol].letter = word[index];
      this.board[i][randomCol].isLocked = true;
      this.board[i][randomCol].background = CELL_COLOR.BLOCKED_CELL;
      index += 1;
      lastCol = randomCol;
    }
  }

  /**
   * Generates a random number between min and max both inclusive
   * @param min 
   * @param max 
   */
  generateARandomNumber(min: number, max: number){
    return Math.round(Math.random() * (max - min))
  }

  reverseWord(word: string) {
    return word.split('').reverse().join('');
  }

  setDefaultColors(){
    for(let i=0; i< BOARD_SIZE; i++){
      for(let j=0; j< BOARD_SIZE; j++){
        if(!this.board[i][j].isLocked){
          if(this.board[i][j].isActive){
            this.board[i][j].background = CELL_COLOR.ACTIVE_CELL;
          } else{
            this.board[i][j].background = CELL_COLOR.INACTIVE_CELL;
          }
        } else{
          this.board[i][j].background = CELL_COLOR.BLOCKED_CELL;
        }       
      }
    }
  }

  onClickRestart(){
    this.initializeTheBoard();
  }

  getWordMeaning(word: string){
    this.dictionaryService.getWordMeanings(word).subscribe(res => {
      this.wordMeaning = res;
    })
  }

  onClickSeeMeaning(){
    this.getWordMeaning(this.foundWord);
  }

  onCloseModal(){
    this.wordMeaning = null;
  }


}
