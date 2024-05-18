function playerHandScore(hand) {
    playerscore = 0;
    let score = {
        K: 4,
        Q: 3,
        J: 2
    }
    for (let i = 0; i < hand.length; i++) {
        playerscore += score[hand[i]];
    }
    return playerscore;
}