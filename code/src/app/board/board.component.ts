import { Component, OnInit } from '@angular/core';
import { BOARD_SIZE, CELL_COLOR, FAILURE_INFO, GRADIENT, INITIALIZING_WORD, NUM_OF_PREFILLED_CELLS, WORDS_FILE_PATH } from '../constants';
import { Cell, WordMeaning, WordValidation } from '../model';
import { FileServiceService } from '../services/file-service.service';
import { DictionaryService } from '../services/dictionary.service';
import { getAListOfRandomIndices } from '../utils/utility-methods';
import { TimeoutInfo } from 'rxjs';

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

  solveStatus: string = "";

  ALL_WORDS: any;

  wordMeaning!: WordMeaning | null;
  disableUserAction: boolean = false;

  timeTaken = "00:00";
  timerStarted : boolean = false; // keeps a track of whether the timer has started or not
  timerID!: any;
  gameStartTime!: any;

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

  onCellClick(row: number, col: number) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (!this.board[i][j].isLocked) {
          if (row == i && col == j) {
            this.board[i][j].isActive = !this.board[i][j].isActive;

          } else {
            this.board[i][j].isActive = false;
          }
          if (this.board[i][j].isActive) {
            this.board[i][j].background = CELL_COLOR.ACTIVE_CELL;
          } else {
            this.board[i][j].background = CELL_COLOR.INACTIVE_CELL;
          }
        }
      }
    }
    if (this.checkIfTheBoardIsFullyFilled(this.board)) {
      this.checkIfTheBoardIsSolved(this.board);
    }
  }

  initializeTheBoard() {
    this.board = [];
    this.failureDetail = "";
    this.failureReason = "";
    for (let i = 0; i < BOARD_SIZE; i++) {
      this.board.push([]);
      for (let j = 0; j < BOARD_SIZE; j++) {
        this.board[i].push({ row: i, col: j, letter: "", isActive: false, isLocked: false, background: CELL_COLOR.INACTIVE_CELL });
      }
    }
    this.fillTheBoardWithAWord(this.shuffleString(INITIALIZING_WORD));
  }




  onCellValueChange(input: string, row: number, col: number) {
    this.solveStatus = "";
    this.failureReason = "";
    this.setDefaultColors();
    this.board[row][col].letter = input;
    if (this.checkIfTheBoardIsFullyFilled(this.board)) {
      if (this.checkIfTheBoardIsSolved(this.board)) {
        this.solveStatus = "SUCCESS";
        this.onBoardSuccessfullCompletion();
      } else {
        this.solveStatus = "TRY AGAIN";
      }
    }
    if(this.timerStarted == false){
      this.timerStarted = true;
      this.timerID = setInterval(() => this.updateTimer(), 100);
      this.gameStartTime = Date.now();
    }
  }

  onBoardSuccessfullCompletion(){
    this.disableUserAction = true;
    clearInterval(this.timerID);
  }

  checkIfTheBoardIsSolved(board: Cell[][]): boolean {
    // checking if the rows contain any duplicates
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let i = 0; i <= BOARD_SIZE - 3; i++) {
        for (let j = i + 3; j <= BOARD_SIZE; j++) {
          let word: string = this.constructWordFromIndices(this.board, row, i, row, j);
          let validationStatus = this.validateWord(word)
          if (validationStatus.hasDuplicates) {
            this.failureDetail = validationStatus.duplicateCharacter + " is repeated";
            this.failureReason = FAILURE_INFO.DUPLICATE;
            this.colorDuplicateCharacters(board, validationStatus.duplicateCharacter, row, true);
            return false;
          }
        }
      }
    }
// checking if the columns contain any duplicates
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let i = 0; i <= BOARD_SIZE - 3; i++) {
        for (let j = i + 3; j <= BOARD_SIZE; j++) {
          let word: string = this.constructWordFromIndices(this.board, i, col, j, col);
          let validationStatus = this.validateWord(word)
          if (validationStatus.hasDuplicates) {
            this.failureDetail = validationStatus.duplicateCharacter + " is repeated";
            this.failureReason = FAILURE_INFO.DUPLICATE;
            this.colorDuplicateCharacters(board, validationStatus.duplicateCharacter, col, false);
            return false;
          }
        }
      }
    }
// checking if the rows contain any valid word
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let i = 0; i <= BOARD_SIZE - 3; i++) {
        for (let j = i + 3; j <= BOARD_SIZE; j++) {
          let word: string = this.constructWordFromIndices(this.board, row, i, row, j);
          let validationStatus = this.validateWord(word);
          if (validationStatus.wordAlreadyExists) {
            if (validationStatus.doesReverseExist) {
              this.failureDetail = this.reverseWord(word.toUpperCase()) + " exists";
              this.failureReason = FAILURE_INFO.WORD_EXISTS;
              this.foundWord = this.reverseWord(word.toUpperCase());
              this.colorExistingWord(this.board, row, j, row, i);
            } else {
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
// checking if the cols contain any valid word
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let i = 0; i <= BOARD_SIZE - 3; i++) {
        for (let j = i + 3; j <= BOARD_SIZE; j++) {
          let word: string = this.constructWordFromIndices(this.board, i, col, j, col);
          let validationStatus = this.validateWord(word);
          if (validationStatus.wordAlreadyExists) {
            if (validationStatus.doesReverseExist) {
              this.failureDetail = this.reverseWord(word.toUpperCase()) + " exists";
              this.failureReason = FAILURE_INFO.WORD_EXISTS;
              this.foundWord = this.reverseWord(word.toUpperCase());
              this.colorExistingWord(this.board, j, col, i, col);
            } else {
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

  colorDuplicateCharacters(board: Cell[][], char: string, index: number, isRow: boolean) {
    if (isRow) {
      for (let i = 0; i < BOARD_SIZE; i++) {
        if (board[index][i].letter === char && !board[index][i].isLocked) {
          board[index][i].background = CELL_COLOR.DUPLICATE_CHAR_CELL;
        }
      }
    } else {
      for (let i = 0; i < BOARD_SIZE; i++) {
        if (board[i][index].letter === char && !board[index][i].isLocked) {
          board[i][index].background = CELL_COLOR.DUPLICATE_CHAR_CELL;
        }
      }
    }
  }

  colorExistingWord(board: Cell[][], startRow: number, startCol: number, endRow: number, endCol: number) {
    if (startRow == endRow) {
      if (startCol < endCol) {
        for (let i = startCol; i < endCol; i++) {
          let colorKey = `leftToRight_${i - startCol}`;
          board[startRow][i].background = GRADIENT[colorKey];
        }
      } else {
        for (let i = startCol - 1; i >= endCol; i--) {
          let colorKey = `rightToLeft_${startCol - i - 1}`;
          board[startRow][i].background = GRADIENT[colorKey];
        }
      }
    } else if (startCol == endCol) {
      if (startRow < endRow) {
        for (let i = startRow; i < endRow; i++) {
          let colorKey = `topToBottom_${i - startRow}`;
          board[i][startCol].background = GRADIENT[colorKey];
        }
      } else {
        for (let i = startRow - 1; i >= endRow; i--) {
          let colorKey = `bottomToTop_${startRow - i - 1}`;
          board[i][startCol].background = GRADIENT[colorKey];
        }
      }
    }
  }

  constructWordFromIndices(board: Cell[][], startRow: number, startCol: number, endRow: number, endCol: number): string {
    let word: string = "";
    if (startRow == endRow) {
      for (let i = startCol; i < endCol; i++) {
        word += board[startRow][i].letter;
      }
    } else if (startCol == endCol) {
      for (let i = startRow; i < endRow; i++) {
        word += board[i][startCol].letter;
      }
    }
    return word;
  }


  checkIfTheBoardIsFullyFilled(board: Cell[][]): boolean {
    for (let row of board) {
      for (let cell of row) {
        if (cell.letter === "") {
          this.solveStatus = "";
          this.foundWord = "";
          return false;
        }
      }
    }
    return true;
  }

  wordAlreadyExists(word: string) {
    word = word.toLowerCase();
    for (let w of this.ALL_WORDS) {
      if (word === w) return true;
    } return false;
  }

  validateWord(word: string): WordValidation {
    let duplicateCharacter = this.hasDuplicateCharacters(word);
    if (duplicateCharacter != "") {
      return { hasDuplicates: true, wordAlreadyExists: false, duplicateCharacter: duplicateCharacter, doesReverseExist: false };
    } else if (this.wordAlreadyExists(word)) {
      return { hasDuplicates: false, wordAlreadyExists: true, duplicateCharacter: "", doesReverseExist: false };
    } else if (this.wordAlreadyExists(this.reverseWord(word))) {
      return { hasDuplicates: false, wordAlreadyExists: true, duplicateCharacter: "", doesReverseExist: true };
    }
    return { hasDuplicates: false, wordAlreadyExists: false, duplicateCharacter: "", doesReverseExist: false };
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

  fillTheBoardWithAWord(word: string) {
    let randomIndices = getAListOfRandomIndices(BOARD_SIZE, NUM_OF_PREFILLED_CELLS);
    for (let i = 0; i < NUM_OF_PREFILLED_CELLS; i++) {
      let row = Math.floor(randomIndices[i] / BOARD_SIZE);
      let col = randomIndices[i] % BOARD_SIZE;
      let randomLetterIndex = this.generateARandomNumber(0, word.length - 1);
      while(this.hasDuplicateInRowOrColumn(row, col, word[randomLetterIndex])){
        randomLetterIndex = this.generateARandomNumber(0, word.length - 1);      
      }
      this.board[row][col].letter = word[randomLetterIndex];
      console.log("The letter ", word[randomLetterIndex], " goes in ", row, col);
      this.board[row][col].isLocked = true;
      this.board[row][col].background = CELL_COLOR.BLOCKED_CELL;
    }
  }

  /**
   * Generates a random number between min and max both inclusive
   * @param min 
   * @param max 
   */
  generateARandomNumber(min: number, max: number) {
    return Math.round(Math.random() * (max - min))
  }

  reverseWord(word: string) {
    return word.split('').reverse().join('');
  }

  setDefaultColors() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (!this.board[i][j].isLocked) {
          if (this.board[i][j].isActive) {
            this.board[i][j].background = CELL_COLOR.ACTIVE_CELL;
          } else {
            this.board[i][j].background = CELL_COLOR.INACTIVE_CELL;
          }
        } else {
          this.board[i][j].background = CELL_COLOR.BLOCKED_CELL;
        }
      }
    }
  }

  onClickRestart() {
    this.initializeTheBoard();
    this.disableUserAction = false;
    clearInterval(this.timerID);
    this.timerID = null;
    this.timeTaken = "00:00";
  }

  getWordMeaning(word: string) {
    this.dictionaryService.getWordMeanings(word).subscribe(res => {
      this.wordMeaning = res;
      
    },
      error => {
        console.error("Error: ", error.message);
        alert("Sorry, no meanings found")
      })
  }

  onClickSeeMeaning() {
    this.getWordMeaning(this.foundWord);
  }

  onCloseModal() {
    this.wordMeaning = null;
  }

  shuffleString(inputString: string): string {
    const stringArray = inputString.split(''); // Convert the string to an array of characters
    for (let i = stringArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
      [stringArray[i], stringArray[j]] = [stringArray[j], stringArray[i]]; // Swap characters
    }
    return stringArray.join(''); // Convert the array back to a string
  }

  /**
   * Returns true if there is a duplicate, false otherwise
   * @param row 
   * @param col 
   * @param letter 
   * @returns 
   */
  hasDuplicateInRowOrColumn(row: number, col: number, letter: string): boolean{
    console.log("Checking for letter ", letter);
    // check in row
    let countInRow = 0;
    let countInCol = 0;
    for(let i=0; i< BOARD_SIZE; i++){
      if(this.board[row][i].letter === letter){
        countInRow += 1;
      }
    }
    for(let i=0; i< BOARD_SIZE; i++){
      if(this.board[i][col].letter === letter){
        countInCol += 1;
      }
    }
    console.log(JSON.stringify(this.board.map(r => r.map(c => c.letter))));
    console.log("COunt in row ", countInRow, "Count in col ", countInCol);
    if(countInRow >= 1 || countInCol >= 1){
      return true;
    }
    return false;
  }

  updateTimer(){
    const millisElapsed = Date.now() - this.gameStartTime;
    const secondsElapsed = millisElapsed / 1000;
    const minutesElapsed = secondsElapsed / 60;

    const millisTest = this.formatNumber(millisElapsed % 1000, 1);
    const secondsText = this.formatNumber(Math.floor(secondsElapsed) % 60, 2);
    const minutesText = this.formatNumber(Math.floor(minutesElapsed),2);

    this.timeTaken = `${minutesText}:${secondsText}`;
  }

  formatNumber(number: number, desiredLength: number){
    const stringNumber = String(number);
    return stringNumber.padStart(desiredLength, '0');
  }


}
