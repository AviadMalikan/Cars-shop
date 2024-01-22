'use strict'

const STORAGE_KEY = 'carsDB'
const gVendors = ['audi', 'mazda', 'toyota', 'bmw', 'kia']

let pageSize = 5
let gPageIdx = 0
let gCars
let gFilterBy = { vendor: '', minSpeed: 0 }
let gShowBy = 'cards'

_createCars()

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

function getCars() {
    var cars = gCars.filter(car => car.vendor.includes(gFilterBy.vendor) && car.maxSpeed >= gFilterBy.minSpeed)

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

function setCarFilter(filterBy = {}) {
    gPageIdx = 0
    if (filterBy.vendor !== undefined) gFilterBy.vendor = filterBy.vendor
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
    }
}

function _saveCarToStorage() {
    saveToStorage(STORAGE_KEY, gCars)
}