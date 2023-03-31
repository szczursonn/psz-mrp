import "./components/InputForm.mjs"
import "./components/Results.mjs"
import { MRP } from "./business.mjs"
import { LABELS } from "./utils.mjs"

const makeCalculations = ({ ghp, mrps }) => {

    const shiftedGHPProduction = [...ghp.production]
    for (let i = 0; i < ghp.makeTime; i++) {
        shiftedGHPProduction.shift()
    }

    const mrpIdToDemandTableMap = new Map([['GHP', shiftedGHPProduction]])

    const parents = [['GHP', 0, ghp.name]]
    while (parents.length > 0) {
        const [parentId, bomLevel, parentName] = parents.shift()
        const children = mrps.filter((mrpParams) => mrpParams.parent === parentId)

        for (const child of children) {
            const res = new MRP(child).calculate(mrpIdToDemandTableMap.get(parentId))

            parents.push([child.id, bomLevel + 1, child.name])
            mrpIdToDemandTableMap.set(child.id, res.map((mrp) => mrp.plannedOrders))

            child.parentName = parentName
            child.bomLevel = bomLevel + 1
            child.result = res
        }
    }

    const results = {
        ghp,
        mrps
    }
    openResultsScreen(results)
}

const handleMRPSubmit = (e) => {
    e.stopPropagation()
    makeCalculations(e.detail)
}

const closeResultsScreen = () => {
    document.querySelector('#results-screen').style.height = '0'
}

const openResultsScreen = (results) => {
    document.querySelector('#results-screen').style.height = '100%'
    document.querySelector('#results-screen mrp-results').fill(results)
}

document.querySelector('#results-close-button').addEventListener('click', closeResultsScreen)
document.querySelector('#results-close-button').textContent = LABELS.BACK

document.querySelector('body').addEventListener('mrp submit', handleMRPSubmit)

const TEST_PARAMS = {
    ghp: {
        name: 'Stół',
        stock: 2,
        makeTime: 1,
        demand: [0, 0, 0, 0, 20, 0, 40, 0, 0, 0],
        production: [0, 0, 0, 0, 28, 0, 30, 0, 0, 0]
    },
    mrps: [{
        name: 'Blaty',
        initialStock: 22,
        makeTime: 3,
        batchSize: 40,
        demandMultiplier: 1,
        parent: 'GHP',
        id: '0'
    }, {
        name: 'Płyta pilśniowa',
        initialStock: 10,
        makeTime: 1,
        batchSize: 50,
        demandMultiplier: 1,
        parent: '0',
        id: '1'
    }, {
        name: 'Nogi',
        initialStock: 40,
        makeTime: 2,
        batchSize: 120,
        demandMultiplier: 4,
        parent: 'GHP',
        id: '2'
    }]
}

document.querySelector('#test-button').addEventListener('click', () => {
    makeCalculations(TEST_PARAMS)
})