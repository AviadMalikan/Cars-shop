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

function onAddCar() {
    var vendor = prompt('vendor ?')
    if (vendor) {
        const car = addCar(vendor)
        renderCars()
        // renderVendors()
        flashMsg(`Car Added (id: ${car.id})`)
    } else flashMsg(`Try Again later`)
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

function onReadCar(carId) {
    const car = getCarById(carId)
    const elModal = document.querySelector('.modal')
    if (elModal.classList.value.includes('open')) return elModal.classList.remove('open')

    elModal.querySelector('h3').innerText = car.vendor
    elModal.querySelector('h4 span').innerText = car.maxSpeed
    elModal.querySelector('p').innerText = car.desc

    var strHTML =
        `<button class="rate" onclick="onSetRate('${car.id}',1)">+</button>
    <button class="rate" onclick="onSetRate('${car.id}',-1)">-</button>
    <br>
    <span>${car.rate ? '⭐'.repeat(car.rate) : '⚫'}</span>`
    elModal.querySelector('.rate').innerHTML = strHTML
    elModal.classList.add('open')
}

function onSetRate(carId, num) {
    const car = setRate(carId, num)
    var elSpanModal = document.querySelector('.modal h5 span')
    elSpanModal.innerText = car.rate ? '⭐'.repeat(car.rate) : '⚫'
}

function onAddFavorite(carId) {
    const car = addFavorite(carId)
    let msg = car.isFav ? 'Add to favorite' : 'Remove from favorite'
    flashMsg(`"${car.vendor}" ${msg}`)
    renderCars()
}

function onSetFilterBy(filterBy) {
    const filter = setCarFilter(filterBy)
    renderCars()
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
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