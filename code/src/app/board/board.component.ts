import { Component, OnInit } from '@angular/core';
import { BOARD_SIZE, CELL_COLOR, GRADIENT, INITIALIZING_WORD, WORD_LIST } from '../constants';
import { Cell, WordValidation } from '../model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  board: Cell[][];

  gridSize: string = `repeat(${BOARD_SIZE}, 1fr)`;

  solveStatus : string = "";

  constructor() {
    this.board = [];
    this.initializeTheBoard();
   }

  ngOnInit(): void {
  }

  onCellClick(row: number, col: number){
    for(let i=0; i< BOARD_SIZE; i++){
      for(let j=0; j< BOARD_SIZE; j++){
        if(!this.board[i][j].isLocked){
          if(row == i && col == j){
            this.board[i][j].isActive = !this.board[i][j].isActive;
          } else{
            this.board[i][j].isActive = false;          
          }
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

  initializeTheBoard(){
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
            this.colorDuplicateCharacters(board, validationStatus.duplicateCharacter, row, true);
            return false;
          } else if (validationStatus.wordAlreadyExists){
              if(validationStatus.doesReverseExist){
                this.colorExistingWord(this.board, row, j, row, j);
              } else{
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
            this.colorDuplicateCharacters(board, validationStatus.duplicateCharacter, col, false);
            return false;
          } else if (validationStatus.wordAlreadyExists){
            if(validationStatus.doesReverseExist){
              this.colorExistingWord(this.board, j, col, i, col);
            } else{
              this.colorExistingWord(this.board, i, col, j, col);
            }          
            return false;
          }
        }
      }
    }    
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
        for(let i = endCol-1; i >= startCol; i--){
          let colorKey = `rightToLeft_${endCol - i - 1}`;
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
        for(let i = endRow-1; i >= startRow; i--){
          let colorKey = `bottomToTop_${endRow - i - 1}`;
          board[i][startCol].background = GRADIENT[colorKey];
        }
      }
    }
  }

  constructWordFromIndices(board: Cell[][], startRow: number, startCol: number, endRow: number, endCol: number): string{
    // console.log("(", startRow, startCol, ")", "->", "(", endRow, endCol, ")")
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
          return false;
        }
      }
    }
    return true;
  }

  wordAlreadyExists(word: string){
    for(let w of WORD_LIST){
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

  // use the dictionary API to show the meanings of the word to the user  

}
