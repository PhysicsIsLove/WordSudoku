/**
* Returns a list of random indices for the board of size boardSize
* @param boardSize board size
* @param numOfElements num of random indices needed
*/
export function  getAListOfRandomIndices(boardSize: number, numOfElements: number){
    let arr = [];
    for(let i=0; i< boardSize*boardSize; i++){
        arr.push(i);
    }
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random indexarr[arr[j]]arr[arr[i]]; // Swap characters
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap characters  
    }
    let shuffledArr = arr.splice(0, numOfElements);
    return shuffledArr;
}  
