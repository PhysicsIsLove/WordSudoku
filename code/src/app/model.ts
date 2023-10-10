export interface Cell {
    letter: string;
    isActive: boolean;
    isLocked: boolean;
    background: string;
} 

export interface WordValidation {
    hasDuplicates: boolean,
    wordAlreadyExists: boolean,
    duplicateCharacter: string,
    doesReverseExist: boolean
}