'use strict'

const STORAGE_KEY = 'carsDB'
const gVendors = ['audi', 'mazda', 'toyota', 'bmw', 'kia']

let pageSize = 8
let gPageIdx = 0
let gCars
let gFilterBy = { vendor: '', minSpeed: 0, name: '', minRate: 0 }
let gShowBy = 'cards'

_createCars()

function resetValue() {
    gPageIdx = 0
    gFilterBy = { vendor: '', minSpeed: 0, name: '', minRate: 0 }
    gShowBy = 'cards'
}

function movePage(nextOrBack) {
    let cars = getCars()

    if ((gPageIdx + nextOrBack) * pageSize >= gCars.length || (gPageIdx + nextOrBack) < 0) return
    gPageIdx += nextOrBack

    // gPageIdx += nextOrBack
    // if (gPageIdx * pageSize >= gCars.length) gPageIdx--
    // if (gPageIdx < 0) gPageIdx++
}

function getVendors() {
    return gVendors
}

function getShowBy() {
    return gShowBy
}

function getCars() {
    var cars = gCars.filter(car => car.vendor.includes(gFilterBy.name) && car.vendor.includes(gFilterBy.vendor) && car.maxSpeed >= gFilterBy.minSpeed)

    var startIdx = gPageIdx * pageSize
    return cars.slice(startIdx, startIdx + pageSize)
}

function delateCar(carId) {
    const carIdx = gCars.findIndex(car => carId === car.id)
    gCars.splice(carIdx, 1)
    _saveCarToStorage(STORAGE_KEY)
}

function addCar(vendor) {
    const car = _createCar(vendor)
    if (!gVendors.includes(vendor)) gVendors.push(vendor)
    gCars.unshift(car)
    _saveCarToStorage(STORAGE_KEY)
    return car
}

function getCarById(carId) {
    const car = gCars.find(car => carId === car.id)
    return car
}

function updateCar(carId, newSpeed) {
    const car = gCars.find(car => car.id == carId)
    car.maxSpeed = newSpeed
    _saveCarToStorage()
    return car
}

function setRate(carId, num) {
    const car = getCarById(carId)
    if (car.rate + num < 0 || car.rate + num > 5) return
    car.rate += num
    _saveCarToStorage()
    return car
}

function addFavorite(carId) {
    const car = getCarById(carId)
    car.isFav = !car.isFav
    _saveCarToStorage()
    return car
}

function setCarFilter(filterBy = {}) {
    gPageIdx = 0
    if (filterBy.vendor !== undefined) gFilterBy.vendor = filterBy.vendor
    if (filterBy.name !== undefined) gFilterBy.name = filterBy.name
    if (filterBy.minSpeed !== undefined) gFilterBy.minSpeed = filterBy.minSpeed
    return gFilterBy
}

function setCarSort(sortBy = {}) {
    if (sortBy.maxSpeed !== undefined) {
        gCars.sort((c1, c2) => (c1.maxSpeed - c2.maxSpeed) * sortBy.maxSpeed)
    } else if (sortBy.vendor !== undefined) {
        gCars.sort((c1, c2) => c1.vendor.localeCompare(c2.vendor) * sortBy.vendor)
    }
}

function setShowBy(showBy) {
    gShowBy = showBy
}


function _createCars() {
    let cars = loadFromStorage(STORAGE_KEY)
    if (!cars || !cars.length) { // need some demo data
        cars = []
        for (let i = 0; i < 21; i++) {
            var vendor = gVendors[getRandomInt(0, gVendors.length - 1)]
            cars.push(_createCar(vendor))
        }
    }
    gCars = cars
    _saveCarToStorage(STORAGE_KEY)
}

function _createCar(vendor) {
    return {
        id: makeId(),
        vendor,
        maxSpeed: getRandomInt(50, 250),
        desc: getLorem(),
        rate: getRandomInt(0, 5),
        isFav: false
    }
}

function _saveCarToStorage() {
    saveToStorage(STORAGE_KEY, gCars)
}


function getTableCarSrt(car) {
    return `
    <tr class="car-card">
    <td class="card-text">
    <h5>${car.vendor}</h5>
    <h6>${_trimStr(car.desc)}</h6>
    </td>
    <td>${car.maxSpeed}</td>
    <td>
    <button onclick="onDeleteCar('${car.id}')">Remove</button>
    <button onclick="onReadCar('${car.id}')">Details</button>
    <button onclick="onUpdateCar('${car.id}')">Update</button>
    <button onclick="onAddFavorite('${car.id}')">${car.isFav ? '❤️' : '🖤'}</button>
    </td>
    </tr>`
}

function getCardCarStr(car) {
    return `
    <article class="car-card">
    <button onclick="onDeleteCar('${car.id}')" class="btn-remove">X</button>
    <img onerror="this.src='img/error.png'" src="img/${car.vendor}.png" alt="${car.vendor}">
   <div class="card-text">
   <h5>${car.vendor}</h5>
   <h6>up to <span>${car.maxSpeed}</span></h6>
   </div>
    <div class="utils-btn flex">
    <button onclick="onReadCar('${car.id}')">Details</button>
    <button onclick="onUpdateCar('${car.id}')">Update</button>
    <button onclick="onAddFavorite('${car.id}')" class="btn-fav">${car.isFav ? '❤️' : '🖤'}</button>
    </div>
    </article>`
}


function _trimStr(str) {
    if (str.length > 100) return str.substring(0, 70) + '...'
}