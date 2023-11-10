const jokesList = [
    "Why don't scientists trust atoms? Because they make up everything.",
    "Parallel lines have so much in common. It's a shame they'll never meet.",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Why did the scarecrow win an award? Because he was outstanding in his field.",
    "I used to play piano by ear, but now I use my hands.",
    "The definition of a perfectionist: someone who wants to go from point A to point A+. —David Bez",
    "Two guys stole a calendar. They got six months each. —Submitted by Alex Del Bene",
    "Could a ... ... librarian be called a bookkeeper? ... referee be a game warden? ... dairyman be a cowboy? ... cabinetmaker be the president? —Submitted by J. Lee",
    "Scene: With a patient in my medical exam room Me: How old are your kids? Patient: Forty-four and 39 from my wife who passed away, and from my second wife, 15 and 13. Me: That's quite the age difference! Patient: Well, the older ones didn't give me any grandkids, so I made my own. —Mria Murillo",
    "My daughter received this e-mail from a prospective student prior to the start of the semester: “Dear Professor, I won't be able to come to any of your classes or meet for any of the tests. Is this a problem?” —Carol Harper",
    "An exercise for people who are out of shape: Begin with a five-pound potato bag in each hand. Extend your arms straight out from your sides, hold them there for a full minute, and then relax. After a few weeks, move up to ten-pound potato bags. Then try 50-pound potato bags, and eventually try to get to where you can lift a 100-pound potato bag in each hand and hold your arms straight for more than a full minute. Once you feel confident at that level, put a potato in each bag. —Beverly Gross"
];

// const prompt = require('prompt-sync')();

let Box = document.getElementById("jokeBox");

let jokeNo = Math.random();
jokeNo = jokeNo*10;
jokeNo = Math.floor(jokeNo);

Box.firstElementChild.textContent = "\"" + jokesList[jokeNo] + "\""