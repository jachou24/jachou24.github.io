const buttonIDs = []

const links = [
    "https://jachou24.github.io/GreekMythologyPersonalityQuiz/start.html",
    "https://jachou24.github.io/changeBgColor_subpage/"
]

const allButtons = document.querySelectorAll('button');
allButtons.forEach(button => {
    buttonIDs.push(button.id);
    button.addEventListener("click", function(event) {
        const curbut = event.target;
        let index = buttonIDs.indexOf(curbut.id);
        window.location.href = links[index];
    });
});