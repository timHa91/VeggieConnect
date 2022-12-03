let currentTab = 0
const stepDots = document.getElementsByClassName("step")
const prevButton = document.getElementById("prevButton")
const nextButton = document.getElementById("nextButton")
const content = document.getElementsByClassName("tab")
const form = document.getElementById("regForm")

const showTab = (index) => {
    stepDots[currentTab].setAttribute("class", "step active")

    if (currentTab === 0) {
        content[currentTab].style.display = "inline"
        prevButton.style.display = "none"
    }
    else (prevButton.style.display = "inline")

    if (currentTab === stepDots.length - 1) {
        nextButton.innerHTML = "Submit"
    }
    else nextButton.innerHTML = "Next"
}


const clickHandlerButton = (index) => {
    //Reset old Tab and Dot
    content[currentTab].style.display = "none"
    stepDots[currentTab].setAttribute("class", "step")
    // Set new Tab and Dot
    currentTab = currentTab + index
    if (currentTab >= stepDots.length) {
        form.submit()
        return
    }
    content[currentTab].style.display = "inline"

    showTab(currentTab)
}
showTab(currentTab)


