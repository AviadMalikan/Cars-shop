'use strict'


function onInit() {
    renderCars()
    renderVendors()
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
            <th>Id</th>
            <th>vendor</th>
            <th>Description</th>
            <th>Max speed</th>
            <th>Actions</th>
        </tr>
    </thead>`)
        document.querySelector('.cars-container').innerHTML = strHTMLs.join('') + '</table>'
    } else {
        strHTMLs = cars.map(car => getCardCarStr(car))
        document.querySelector('.cars-container').innerHTML = strHTMLs.join('')
    }
}


function renderVendors() {
    const vendors = getVendors()
    const strHTML = vendors.map(vendor => `<option value="${vendor}">${vendor.charAt(0).toUpperCase() + vendor.substring(1)}</option>`)
    strHTML.unshift(` <option value="">Select Vendor</option>`)
    document.querySelector('.filter-vendor-select').innerHTML += strHTML
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
    elModal.querySelector('h3').innerText = car.vendor
    elModal.querySelector('h4 span').innerText = car.maxSpeed
    elModal.querySelector('p').innerText = car.desc
    elModal.querySelector('.rate').innerText = '⭐'.repeat(car.rate)
    elModal.classList.add('open')
}

function onSetFilterBy(filterBy) {
    const filter = setCarFilter(filterBy)
    renderCars()
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}

function flashMsg(msg) {
    console.log('msg: ', msg)

    const el = document.querySelector('.user-msg')
    console.log('el: ', el)
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