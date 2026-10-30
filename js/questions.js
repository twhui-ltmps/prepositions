// Level 1: Easy Mode Question Bank
const easyBank = [
    { text: "be mean", ans: "to" },
    { text: "be nice", ans: "to" },
    { text: "say sorry", ans: "to" },
    { text: "share (feelings)", ans: "with" },
    { text: "quarrel / argue", ans: "with" },
    { text: "discuss (a problem)", ans: "with" },
    { text: "agree", ans: "with" },
    { text: "disagree", ans: "with" },
    { text: "get on", ans: "with" },
    { text: "help ... (the homework)", ans: "with" },
    { text: "lie", ans: "to" },
    { text: "be jealous", ans: "of" }
];

// Level 2: Hard Mode Question Bank
const hardBank = [
    { text: "afraid / scared", ans: "of" },
    { text: "full", ans: "of" },
    { text: "make fun", ans: "of" },
    { text: "take care", ans: "of" },
    { text: "think", ans: "of" },
    { text: "friendly", ans: "to" },
    { text: "listen", ans: "to" },
    { text: "speak", ans: "to" },
    { text: "talk", ans: "to" },
    { text: "write", ans: "to" },
    { text: "careful", ans: "with" },
    { text: "happy", ans: "with" },
    { text: "angry", ans: "with" },
    { text: "make friends", ans: "with" },
    { text: "play", ans: "with" },
    { text: "fight", ans: "with" }
];

// Level 3: Challenge Mode (Sentence Fill-in-the-blanks)
const challengeBank = [
    { text: "He is always very mean ___ his little sister.", ans: "to" },
    { text: "I am afraid ___ the dark.", ans: "of" },
    { text: "She agreed ___ my plan.", ans: "with" },
    { text: "The glass is full ___ water.", ans: "of" },
    { text: "Don't make fun ___ him.", ans: "of" },
    { text: "You need to speak ___ the manager.", ans: "to" },
    { text: "I like to play ___ my dog.", ans: "with" },
    { text: "Who is going to take care ___ the baby?", ans: "of" },
    { text: "She was very happy ___ her new phone.", ans: "with" },
    { text: "He lied ___ his parents.", ans: "to" },
    { text: "I am jealous ___ her success.", ans: "of" },
    { text: "Please be careful ___ that hot cup.", ans: "with" },
    { text: "I want to discuss this problem ___ you.", ans: "with" },
    { text: "They often quarrel ___ each other.", ans: "with" },
    { text: "She wrote a letter ___ her grandmother.", ans: "to" },
    { text: "It's important to say sorry ___ your friends.", ans: "to" },
    { text: "Are you angry ___ me?", ans: "with" }
];

const typeConfigs = {
    'easy': { bank: easyBank, pts: 10, name: "🌱 Level 1: Easy" },
    'hard': { bank: hardBank, pts: 20, name: "🔥 Level 2: Hard" },
    'challenge': { bank: challengeBank, pts: 30, name: "🏆 Level 3: Challenge" }
};

const prepositions = ["to", "of", "with", "at", "for", "about", "in", "on"];
