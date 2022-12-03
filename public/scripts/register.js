let currentTab = 0
const stepDots = document.getElementsByClassName("step")
const prevButton = document.getElementById("prevButton")
const nextButton = document.getElementById("nextButton")
const contentOne = document.getElementsByClassName("tabOne")
const contentTwo = document.getElementsByClassName("tabTwo")
const contentThree = document.getElementsByClassName("tabThree")

const showTab = (index) => {
    stepDots[currentTab].setAttribute("class", "step active")
    if (currentTab === 0) {
        prevButton.style.display = "none"
        for (let element of contentTwo) {
            element.style.display = "none"
        }
        for (let element of contentOne) {
            element.style.display = "inline"
        }
    }

    if (currentTab === 1) {
        prevButton.style.display = "inline"
        nextButton.style.display = "inline"
        for (let element of contentOne) {
            element.style.display = "none"
        }
        for (let element of contentTwo) {
            element.style.display = "inline"
        }
    }
    if (currentTab === 2) {
        nextButton.style.display = "none"
        prevButton.style.display = "inline"
        for (let element of contentOne) {
            element.style.display = "none"
        }
        for (let element of contentTwo) {
            element.style.display = "none"
        }
        for (let element of contentThree) {
            element.style.display = "inline"
        }
    }
}

const clickHandlerPrevButton = () => {
    stepDots[currentTab].setAttribute("class", "step")
    if (currentTab !== 0) currentTab--
    showTab(currentTab)
}

const clickHandlerNextButton = () => {
    stepDots[currentTab].setAttribute("class", "step")
    if (currentTab !== stepDots.length - 1) currentTab++
    showTab(currentTab)
}

showTab(currentTab)

