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
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random indexarr[arr[j]]arr[arr[i]]; // Swap characters
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap characters  
    }
    let shuffledArr = arr.splice(0, numOfElements);
    return shuffledArr;
}  

export function getAListOfRandomIndicesDistributedUniformly(boardSize: number, numOfElements: number) {
    let totalCells = boardSize * boardSize;
    let evenIndices = [];
    let oddIndices = [];
    for(let i=0; i< totalCells; i++){
        if(i % 2 == 0) evenIndices.push(i);
         else oddIndices.push(i);
    }
    for (let i = evenIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        [evenIndices[i], evenIndices[j]] = [evenIndices[j], evenIndices[i]]; 
    }
    for (let i = oddIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        [oddIndices[i], oddIndices[j]] = [oddIndices[j], oddIndices[i]]; 
    }
    let currentTime = new Date();
    if(currentTime.getMilliseconds() % 2 == 0) {
        return evenIndices.slice(0, numOfElements);
    } else{
        return oddIndices.slice(0, numOfElements);
    }
}


