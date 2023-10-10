export const BOARD_SIZE = 3;

export const WORD_LIST = ['TEA', 'DOG', 'CAT', 'EAT', 'DOG', 'HAT', 'INK', 'JAZZ', 'KITE', 'LAMP', 'MOON', 'NEST', 'ORCA', 'PEAR', 'ROSE', 'STAR', 'TREE', 'UMBRA', 'VASE', 'WOLF', 'YACHT', 'ZEBRA', 'OCEAN', 'LEMON', 'BOOK', 'LOVE', 'RAIN', 'SONG', 'BLUE', 'BIRD', 'LION', 'GOLD', 'FIRE', 'WINE', 'SHIP', 'BELL', 'DARK', 'GIRL', 'HOME', 'KING', 'LAKE', 'NOON', 'TIME', 'CODE', 'DUCK', 'FROG', 'BEAR', 'BABY', 'DEER', 'LIME', 'PINK', 'IRIS', 'SALT', 'SAND', 'FERN', 'MILK'];

export const GRADIENT: any = {
    leftToRight_0: `linear-gradient(90deg, rgba(255,137,90,1) 0%, rgba(255,148,106,1) 100%)`,
    leftToRight_1: `linear-gradient(90deg, rgba(255,148,106,1) 0%, rgba(254,167,134,1) 100%)`,
    leftToRight_2: `linear-gradient(90deg, rgba(254,167,134,1) 0%, rgba(251,181,156,1) 100%)`,
    leftToRight_3: `linear-gradient(90deg, rgba(251,181,156,1) 0%, rgba(255,206,189,1) 100%)`,
    leftToRight_4: `linear-gradient(90deg, rgba(255,206,189,1) 0%, rgba(255,225,217,1) 100%)`,

    rightToLeft_0: `linear-gradient(-90deg, rgba(255,137,90,1) 0%, rgba(255,148,106,1) 100%)`,
    rightToLeft_1: `linear-gradient(-90deg, rgba(255,148,106,1) 0%, rgba(254,167,134,1) 100%)`,
    rightToLeft_2: `linear-gradient(-90deg, rgba(254,167,134,1) 0%, rgba(251,181,156,1) 100%)`,
    rightToLeft_3: `linear-gradient(-90deg, rgba(251,181,156,1) 0%, rgba(255,206,189,1) 100%)`,
    rightToLeft_4: `linear-gradient(-90deg, rgba(255,206,189,1) 0%, rgba(255,225,217,1) 100%)`,

    topToBottom_0: `linear-gradient(180deg, rgba(255,137,90,1) 0%, rgba(255,148,106,1) 100%)`,
    topToBottom_1: `linear-gradient(180deg, rgba(255,148,106,1) 0%, rgba(254,167,134,1) 100%)`,
    topToBottom_2: `linear-gradient(180deg, rgba(254,167,134,1) 0%, rgba(251,181,156,1) 100%)`,
    topToBottom_3: `linear-gradient(180deg, rgba(251,181,156,1) 0%, rgba(255,206,189,1) 100%)`,
    topToBottom_4: `linear-gradient(180deg, rgba(255,206,189,1) 0%, rgba(255,225,217,1) 100%)`,

    bottomToTop_0: `linear-gradient(0deg, rgba(255,137,90,1) 0%, rgba(255,148,106,1) 100%)`,
    bottomToTop_1: `linear-gradient(0deg, rgba(255,148,106,1) 0%, rgba(254,167,134,1) 100%)`,
    bottomToTop_2: `linear-gradient(0deg, rgba(254,167,134,1) 0%, rgba(251,181,156,1) 100%)`,
    bottomToTop_3: `linear-gradient(0deg, rgba(251,181,156,1) 0%, rgba(255,206,189,1) 100%)`,
    bottomToTop_4: `linear-gradient(0deg, rgba(255,206,189,1) 0%, rgba(255,225,217,1) 100%)`,
}

export const CELL_COLOR: any = {
    BLOCKED_CELL: "gray",
    ACTIVE_CELL: "green",
    INACTIVE_CELL: "red",
    DUPLICATE_CHAR_CELL: "blue",
}