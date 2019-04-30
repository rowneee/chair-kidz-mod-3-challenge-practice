const allKidsLink = `http://localhost:3000/api/v1/kids`
const chairKidLink = `http://localhost:3000/api/v1/kids/chair`
const voteKidLink = `http://localhost:3000/api/v1/kids/vote`
const throneKidLink = `http://localhost:3000/api/v1/kids/throne`

//your code here
// puts all the kids in the dropdown menu/display all Kidz
// var e = document.getElementById("ddlViewBy");
// var strUser = e.options[e.selectedIndex].value;
const kidzDropdown = document.getElementById("kid-options")
const throne = document.getElementById("throne")

function addGOT(kid) {
  fetch(throneKidLink, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      kid_id: `${kid}`
    })
  }).then(function(json) {
    placeKidz()
  })
}

// display all kids in the dropdown
// if kid is not in a chair (in-chair === false) then show them in the dropdown
// if throne === true, make the innerHTML of the throne div the image/name of the person with 5 votes
// use the kids id to do this
// if throne === false, refresh by rendering the helper function that populated the chair container with all selected kids
function placeKidz() {
  fetch(allKidsLink)
    .then(res => res.json())
    .then(kidz => {
      kidzDropdown.innerHTML = ""
      chairsCont.innerHTML = ""
      kidz.data.forEach(kid => {
        if (kid.attributes["in-chair"] === false) {
          kidzDropdown.innerHTML += `
          <option value="${kid.id}">${kid.attributes.name}</option>
          `
        }
        if (kid.attributes.throne === true) {
          throne.innerHTML = `
            <img class="image" src="${kid.attributes["img-url"]}" />
            <br>
            <br>
            <div data-score=${kid.attributes.votes} data-id=${kid.id} class="attribute">
            ${kid.attributes.name}
          `
        }
        if (kid.attributes.throne === false) {
          findTrueKidz(kid)
        }
      })
    })
}

//invoke this function so that it renders every time we go to this page
placeKidz()

const addKid = document.getElementById("add-kid")
const chairsCont = document.getElementById("chairs-container")


//if the kids has been selected and in-chair === true, then populate the chair container with some HTML
function findTrueKidz(kid) {
  if (kid.attributes["in-chair"] === true) {
    chairsCont.innerHTML += `
    <div id="${kid.id}-container" class="kid-chair-container">
      <img class="image" src="${kid.attributes["img-url"]}" />
      <br>
      <br>
      <div data-score=${kid.attributes.votes} data-id=${kid.id} class="attribute">
      ${kid.attributes.name}
      <br>
      Score: ${kid.attributes.votes}
      <br>
      <a class="vote-down" href="#">Vote Down</a> | <a class="vote-up" href="#">Vote Up</a>
      <br>
      <a class="hide" href="#">Hide</a>
      </div>
    </div>
    `
  }
}

addKid.addEventListener("click", function(e) {
  const kidId = kidzDropdown.options[kidzDropdown.selectedIndex].value
  fetch(chairKidLink, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      kid_id: `${kidId}`
    })
  }).then(res => res.json())
  .then(kid => {
    placeKidz()
    //we dont need these bad boyz (thenz)
  })

})

// const voteUp = document.querySelector(".vote-up")
// const voteDown = document.querySelector(".vote-down")

chairsCont.addEventListener("click", function(e) {
  e.preventDefault()
  if (e.target.className === 'vote-up') {
    const votez = parseInt(e.target.parentElement.dataset.score)
    const dizKidzId = e.target.parentElement.dataset.id
    if (votez === 4) {
      addGOT(dizKidzId)
    } else {
    fetch(voteKidLink, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        kid_id: `${dizKidzId}`,
        vote: "up"
      })
    }).then(res => res.json())
    .then(kid => {
      placeKidz()
    })
  }
  }
  if (e.target.className === 'vote-down') {
    const votez = parseInt(e.target.parentElement.dataset.score)
    const dizKidzId = e.target.parentElement.dataset.id
    if (votez === -4) {
      begoneKidz(dizKidzId)
    } else {
    fetch(voteKidLink, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        kid_id: `${dizKidzId}`,
        vote: "down"
      })
    }).then(res => res.json())
    .then(kid => {
      placeKidz()
    })
    }
  }

})

function begoneKidz(kid) {

  fetch(allKidsLink, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      kid_id: `${kid}`
    })
  })
  .then(res => res.json())
  .then(function (json) {
    console.log(json)
    placeKidz()
  })
}

const btn = document.getElementById("create-kid")

btn.addEventListener("click", function(e){
  const name = document.getElementById("new-name")
  const image = document.getElementById("new-image")

  fetch(allKidsLink, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: `${name.value}`,
      "img-url": `${image.value}`
    })
  })
  .then(res => res.json())
  .then(console.log)
})
