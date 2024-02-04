'use strict'


function onInit() {
    resetValue()
    renderCars()
    // renderVendors()
}


function renderCars() {
    const cars = getCars()
    let strHTMLs
    let viewStatus = getShowBy()
    if (viewStatus === 'table') {
        strHTMLs = cars.map(car => getTableCarSrt(car))
        strHTMLs.unshift(`
        <table><thead>
        <tr>
            <th>Description</th>
            <th>Max speed</th>
            <th>Actions</th>
        </tr>
    </thead>`)
        document.querySelector('.cars-preview').innerHTML = strHTMLs.join('') + '</table>'
        document.querySelector('.cars-preview').classList.add('cars-preview-table')
    } else {
        strHTMLs = cars.map(car => getCardCarStr(car))
        document.querySelector('.cars-preview').innerHTML = strHTMLs.join('')
        document.querySelector('.cars-preview').classList.remove('cars-preview-table')
    }
}


function renderVendors() {
    const vendors = getVendors()
    const strHTML = vendors.map(vendor => `<option value="${vendor}">${vendor.charAt(0).toUpperCase() + vendor.substring(1)}</option>`)
    strHTML.unshift(` <option value="">Select Vendor</option>`)
    document.querySelector('.filter-vendor-select').innerHTML = strHTML
}

function onSetShowBy(showBy) {
    setShowBy(showBy)
    renderCars()
}

function onDeleteCar(carId) {
    delateCar(carId)
    renderCars()
    flashMsg(`Car Deleted`)
}
function onAddCar(e, car) {
    e.preventDefault()

    const vendor = document.querySelector('.vendor-name-box').value

    if (vendor) {
        const car = addCar(vendor)
        renderCars()
        // renderVendors()
        flashMsg(`Car Added (id: ${car.id})`)
    } else flashMsg(`Try Again later`)
    onCloseModal()
}



function onUpdateCar(carId) {
    const car = getCarById(carId)
    var newSpeed = +prompt('speed?', car.maxSpeed)
    if (newSpeed && car.maxSpeed !== newSpeed) {
        const car = updateCar(carId, newSpeed)
        renderCars()
        flashMsg(`Speed updated to ${car.maxSpeed}`)
    }
}


function onSetModalBy(type, carId) {
    const elBgModal = document.querySelector('.modal-bg')
        .classList.add('open')
    const elModal = document.querySelector('.modal')
    let strHTML
    const car = getCarById(carId)

    if (type === 'readCar') onReadCar(carId)
    else {
        strHTML = `<form onsubmit="onAddCar(event)" class="filter-text">
        <input type="text" class="vendor-name-box" id="vendor-box" value="${car ? car.vendor : ''}">
        <label for="vendor-box">vendor</label>
        <input type="number" min="1" max="500" value="${car ? car.maxSpeed : ''}">
        <button onclick="onAddCar(event,${car ? car : ''})">AddCar</button>
        </form>
        <button onclick="onCloseModal(event)" class="close-btn">X</button>
        `
        elModal.innerHTML = strHTML
        elModal.classList.add('open')
    }


    // else if (type === 'updateCar') onUpdateCar(carId)
    // else onAddCar()

}

function onReadCar(carId) {
    const car = getCarById(carId)
    const elBgModal = document.querySelector('.modal-bg').classList.add('open')
    const elModal = document.querySelector('.modal')

    const strHTML = `
    <img src="img/${car.vendor}.png"/>
    <h3>${car.vendor} </h3>
    <h4>max speed <span>${car.maxSpeed}</span></h4>
    <p>${car.desc}</p>
    <h4 class="rate">${car.rate ? '⭐'.repeat(car.rate) : '⚫'}</h4>
    <button onclick="onSetRate('${car.id}',1)">+</button>
    <button onclick="onSetRate('${car.id}',-1)">-</button>
    <button onclick="onCloseModal(event)" class="close-btn">X</button>
    `
    elModal.innerHTML = strHTML
    // elModal.querySelector('.rate').innerHTML = strHTML
    elModal.classList.add('open')
}

function onSetRate(carId, num) {
    const car = setRate(carId, num)
    var elh4Modal = document.querySelector('.modal h4.rate ')
    elh4Modal.innerText = car.rate ? '⭐'.repeat(car.rate) : '⚫'
}

function onAddFavorite(carId) {
    const car = addFavorite(carId)
    let msg = car.isFav ? 'Add to favorite' : 'Remove from favorite'
    flashMsg(`"${car.vendor}" ${msg} `)
    renderCars()
}

function onSetFilterBy(filterBy) {
    const filter = setCarFilter(filterBy)
    renderCars()
}

function onCloseModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.remove('open')
    elModal.innerHTML = ''
    document.querySelector('.modal-bg').classList.remove('open')
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg

    el.classList.add('open')
    setTimeout(() => el.classList.remove('open'), 3000)
}

function onSetSortBy() {
    const prop = document.querySelector('.sort-by').value
    const isDec = document.querySelector('.sort-desc').checked

    const sortBy = {}
    sortBy[prop] = isDec ? -1 : 1
    setCarSort(sortBy)
    renderCars()
}

function onMovePage(nextOrBack) {
    const page = movePage(nextOrBack)
    renderCars()
}