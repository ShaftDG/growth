
export default class GenerateWinCombination {

    constructor(numCilinder, numPlayingSymbPerCilinder, totalSymb)
    {
        this.numCilinder = numCilinder;
        this.numPlayingSymbPerCilinder = numPlayingSymbPerCilinder;
        this.totalSymb = totalSymb;

        // this.totalRound = 0;

        this.bet = 10;
        this.maxBet = 1000;
        this.minBet = 10;
        this.isMaxBet = false;
        this.isMinBet = true;

        this.minLines = 3;
        this.isMaxLines = true;
        this.isMinLines = false;

        this.totalScore = 250250;

        this.stopPositionArray = [];

        this.payTable = [
            [0, 25, 100, 1000, 5000], // SYMB_Square
            [0, 25, 50, 200, 500], // SYMB_Diamond
            [0, 25, 50, 100, 200], // SYMB_Pad
            [0, 25, 50, 100, 200], // SYMB_Octa
            [0, 25, 50, 100, 200], // SYMB_Coin
            [0, 25, 50, 100, 200], // SYMB_Ring
            [0, 25, 50, 100, 200], // SYMB_Bottle
            [0, 0, 0, 0, 0], // SYMB_PartMap
            [0, 25, 50, 100, 200], // SYMB_Clover
            [0, 15, 30, 100, 120], // SYMB_Cherry
            [0, 25, 50, 200, 500], // SYMB_Grapes
            [0, 25, 50, 100, 200], // SYMB_Strawberry
        ];

        this.freeSpinSymb = 7;
        this.numFreeSpinSymb = 0;
        this.numFreeSpin = 0;
        this.isFreeSpin = false;
        this.boolFreeSpin = false;
        this.numFreeSpinToRound = 2;

        this.r = [
            [0, 0, 3, 2, 0, 2, 2, 7, 1, 5, 6, 2, 7, 5, 6, 5, 3, 1, 4, 1, 4, 6, 4, 3, 0],
            [0, 0, 0, 3, 4, 6, 4, 2, 4, 0, 2, 5, 0, 5, 0, 5, 4, 1, 0, 1, 6, 7, 0, 7, 6],
            [3, 0, 0, 2, 2, 6, 2, 5, 7, 5, 0, 5, 6, 3, 7, 6, 4, 2, 4, 0, 4, 1, 1, 3, 1],
            [0, 0, 0, 1, 3, 0, 4, 0, 6, 4, 0, 4, 3, 1, 7, 2, 6, 5, 7, 5, 6, 5, 1, 0, 6],
            [0, 0, 0, 5, 2, 5, 1, 2, 4, 6, 4, 2, 3, 7, 4, 3, 3, 5, 0, 6, 4, 7, 2, 5, 0]
        ];
        /*  this.r = [
              [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ],
              [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ],
              [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ],
              [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ],
              [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ]
          ];*/
        /* this.r = [
             [ 0, 2, 4, 1, 0, 2, 5, 4, 0, 4, 3, 1, 5, 2, 0, 1, 4, 2, 3, 5, 0, 2, 4, 1, 0 ],
             [ 1, 0, 5, 3, 4, 0, 2, 5, 2, 3, 4, 0, 1, 5, 2, 4, 1, 0, 4, 5, 1, 0, 4, 0, 2 ],
             [ 2, 4, 1, 5, 2, 0, 4, 3, 5, 0, 1, 4, 2, 3, 1, 5, 2, 4, 1, 5, 2, 0, 1, 4, 2 ],
             [ 0, 1, 4, 2, 0, 1, 5, 4, 0, 1, 3, 4, 0, 1, 0, 2, 5, 1, 0, 2, 0, 1, 0, 2, 0 ],
             [ 1, 4, 1, 0, 2, 4, 2, 3, 1, 3, 4, 0, 2, 0, 2, 5, 1, 5, 1, 0, 2, 4, 2, 0, 1 ]
         ];*/

        this.arrayCombination = [];
        for (var j = 0; j < this.numCilinder; j++) {
            this.arrayCombination[j] = [];
        }
        this.moveArrayFreeSpinSymb = [];
        for (var j = 0; j < this.numCilinder; j++) {
            this.moveArrayFreeSpinSymb[j] = [];
        }

        this.maskWinLine = [
            [1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0],
            [2, 2, 2, 2, 2],
            [0, 1, 2, 1, 0],
            [2, 1, 0, 1, 2],
            // [0, 0, 1, 0, 0],
            // [2, 2, 1, 2, 2],
            // [1, 0, 1, 0, 1],
            // [1, 2, 1, 2, 1]
        ];

        this.maxLines = this.maskWinLine.length;
        this.winLineNum = this.maxLines;

        this.numSymbline = [];
        for (var j = 0; j < this.maxLines; j++) {
            this.numSymbline[j] = 0;
        }

        this.numWinSymbline = [];
        for (var j = 0; j < this.maxLines; j++) {
            this.numWinSymbline[j] = 0;
        }

        this.firstSymbline = [];
        for (var j = 0; j < this.maxLines; j++) {
            this.firstSymbline[j] = 0;
        }

        this.winLineArray = [];
        for (var j = 0; j < this.maxLines; j++) {
            this.winLineArray[j] = [];
        }

        this.moveArray = [];
        for (var j = 0; j < this.maskWinLine.length; j++) {
            this.moveArray[j] = [];
            for (var i = 0; i < this.maskWinLine[j].length; i++) {
                this.moveArray[j][i] = [0, 0, 0];
            }
        }
    }

    randomInteger(min, max) {
        var rand = min + Math.random() * (max - min);
        rand = Math.floor(rand);
        return rand;
    }

    placeBet () {
        if (this.numFreeSpin <= 0) {
            this.totalScore -= this.bet * (this.winLineNum / 3);
        } else {
            this.numFreeSpin--;
        }
    }

    getTotalBet () {
        return this.bet * (this.winLineNum / 3);
    }

    gettingWinnings () {
        this.totalScore += this.getTotalRound();
        this.numSymbline = [];
        for (var j = 0; j < this.maskWinLine.length; j++) {
            this.numSymbline[j] = 0;
        }
        console.log("Total Score", this.totalScore);
    }

    toIncreaseBet () {
        this.bet = this.bet < this.maxBet * 0.1 ? this.bet += 10 : this.bet < this.maxBet * 0.5 ? this.bet += 50 : this.bet < this.maxBet ? this.bet += 100 : this.maxBet;
        this.isMaxBet = this.bet === this.maxBet;
        this.isMinBet = false;
    }

    reduceBet () {
        this.bet = this.bet > this.maxBet * 0.5 ? this.bet -= 100 : this.bet > this.maxBet * 0.1 ? this.bet -= 50 : this.bet > this.minBet ? this.bet -= 10 : this.minBet;
        this.isMinBet = this.bet === this.minBet;
        this.isMaxBet = false;
    }

    toIncreaseLines () {
        this.winLineNum = this.winLineNum < this.maxLines - this.minLines ? this.winLineNum += this.minLines : this.maxLines;
        this.isMaxLines = this.winLineNum === this.maxLines;
        this.isMinLines = false;
    }

    reduceLines () {
        this.winLineNum = this.winLineNum > this.minLines ? this.winLineNum -= this.minLines : this.minLines;
        this.isMinLines = this.winLineNum === this.minLines;
        this.isMaxLines = false;
    }

    setMaxBet () {
        this.bet = this.maxBet;
        this.isMaxBet = true;
        this.isMinBet = false;
    }

    generate () {
        this.numFreeSpinSymb = 0;
        this.boolPlusFreeSpin = false;
        this.isFreeSpin = false;
        for (var j = 0; j < this.numCilinder; j++) {
            var stopPosition = this.randomInteger(0, this.r[0].length - 1);
            this.stopPositionArray[j] = stopPosition;
            for (var i = 0; i < this.numPlayingSymbPerCilinder; i++) {
                this.arrayCombination[j][i] = this.r[j][(stopPosition > 0) ? stopPosition + i - 1 : (i > 0) ? stopPosition + i - 1 : this.r[0].length - 1];
                // this.arrayCombination[j][i] = 3;
                if (this.arrayCombination[j][i] == this.freeSpinSymb) {
                    this.moveArrayFreeSpinSymb[j][i] = 1;
                    this.numFreeSpinSymb++;
                } else {
                    this.moveArrayFreeSpinSymb[j][i] = 0;
                }
            }
        }
        console.log("=================================");
        if (this.numFreeSpinSymb >= 3) {
            this.numFreeSpin += this.numFreeSpinToRound;
            console.log("FreeSpin: Yes - ", this.numFreeSpin);
            console.log("Move Array Free Spin Symb", this.moveArrayFreeSpinSymb);
            this.numFreeSpinSymb = 0;
            this.isFreeSpin = true;
        }
        if (this.numFreeSpin <= 0) {
            console.log("FreeSpin: No");
            this.numFreeSpinSymb = 0;
        }
        console.log("Stop Position Array", this.stopPositionArray);
        // console.log("this.arrayCombination", this.arrayCombination);
        this.winLine(this.arrayCombination);
        this.winLineRound();
        this.moveWinLine();
        console.log("Round Score", this.getTotalRound());
        return this.arrayCombination;
    }

    winLine (arrayCombination) {
        for (var j = 0; j < this.maskWinLine.length; j++) {
            for (var i = 0; i < this.maskWinLine[j].length; i++) {
                this.winLineArray[j][i] = arrayCombination[i][this.maskWinLine[j][i]];
            }
        }

        console.log("Line Array", this.winLineArray);
    }

    winLineRound () {
        for (var j = 0; j < this.winLineNum; j++) {
            this.firstSymbline[j] = this.winLineArray[j][0];
            for (var i = 0; i < this.winLineArray[j].length - 1; i++) {
                if (this.winLineArray[j][i] == this.winLineArray[j][i + 1] && this.winLineArray[j][i] == this.firstSymbline[j]) {
                    this.numSymbline[j]++;
                } else {
                    break;
                }
            }
        }
        // console.log("this.firstSymbline", this.firstSymbline);
        // console.log("this.numSymbline", this.numSymbline);
    }

    moveWinLine () {
        for (var j = 0; j < this.winLineNum; j++) {
            for (var i = 0; i < this.maskWinLine[j].length; i++) {
                if (this.payTable[this.firstSymbline[j]][this.numSymbline[j]] > 0) {
                    this.moveArray[j][i][this.maskWinLine[j][i]] = (i <= this.numSymbline[j] && this.numSymbline[j] > 0) ? 1 : 0;
                    this.numWinSymbline[j] = 1;
                } else {
                    this.moveArray[j][i][this.maskWinLine[j][i]] = 0;
                    this.numWinSymbline[j] = 0;
                }
            }
        }

        console.log("Move Array", this.moveArray);
        console.log("Num Win Symb line", this.numWinSymbline);
    }

    getTotalRound () {
        var totalRound = 0;
        for (var i = 0; i < this.numSymbline.length; i++) {

            totalRound += this.payTable[this.firstSymbline[i]][this.numSymbline[i]];
        }
        return totalRound * ((this.bet * (this.winLineNum / 3)) / 10.0);
    }
}

  /*[  0 ,  0 ,  100 , 1000 , 5000 ], // SYMB_Seven
    [  0 ,  0 ,   50 ,  200 ,  500 ], // SYMB_Diamond
    [  0 ,  0 ,   50 ,  200 ,  500 ], // SYMB_Grapes
    [  0 ,  0 ,   20 ,   50 ,  200 ], // SYMB_Bar
    [  0 ,  0 ,   20 ,   50 ,  200 ], // SYMB_Bell
    [  0 ,  0 ,   20 ,   50 ,  200 ], // SYMB_Strawberry
    [  0 ,  5 ,   20 ,   50 ,  200 ], // SYMB_Cherry
    [  0 ,  0 ,    2 ,   10 ,   50 ], // SYMB_Crown
    [  0 ,  0 ,    2 ,   10 ,   50 ], // SYMB_Clover
    [  0 ,  0 ,    2 ,   10 ,   50 ], // SYMB_Horseshoe
    [  0 ,  0 ,    2 ,   10 ,   50 ], // SYMB_Dice
    [  0 ,  0 ,    2 ,   10 ,   50 ], // SYMB_Coins
    [  0 ,  0 ,    2 ,   10 ,   50 ]  // SYMB_Dice*/