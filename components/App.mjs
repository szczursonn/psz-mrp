import "./InputForm.mjs"
import "./Results.mjs"
import { MRP } from "../business.mjs"
import { LABELS, REPO_URL, TEST_PARAMS } from "../utils.mjs"

class App extends HTMLElement {
    static TAG = 'mrp-app'

    connectedCallback() {
        this.innerHTML = `
            <div class="results-screen"
                style="height: 0; width: 100%; position: fixed; z-index: 1; left: 0; bottom: 0; background-color: rgba(255, 255, 255); overflow-x: hidden; transition: 0.5s;">
                <button class="btn btn-light mt-5 ms-5">${LABELS.BACK}</button>
                <div style="width: 100%; text-align: center; margin-top: 10px; margin-bottom: 75px;">
                    <mrp-results></mrp-results>
                </div>
            </div>

            <input-form></input-form>

            <button class="test-button">TEST - no import</button>
            <button class="test-button-2">TEST - import</button>

            <footer class="d-flex justify-content-center">
                <a class="opacity-75 mt-3 d-flex justify-content-center" href="${REPO_URL}">
                    <img class="w-50" src="github-mark.svg" alt="Github logo">
                </a>
            </footer>
        `

        this.querySelector('div.results-screen button').addEventListener('click', this.closeResultsScreen.bind(this))

        this.addEventListener('mrp submit', this.handleMRPSubmit.bind(this))

        this.querySelector('button.test-button').addEventListener('click', () => {
            this.makeCalculations(TEST_PARAMS)
        })
        this.querySelector('button.test-button-2').addEventListener('click', () => {
            this.makeCalculations({
                ...TEST_PARAMS,
                allowImport: true
            })
        })
    }

    makeCalculations({ ghp, mrps, allowImport }) {
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
                const res = new MRP(child).calculate(mrpIdToDemandTableMap.get(parentId), allowImport)

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

        this.openResultsScreen(results)
    }

    handleMRPSubmit(e) {
        e.stopPropagation()
        this.makeCalculations(e.detail)
    }

    closeResultsScreen = () => {
        this.querySelector('.results-screen').style.height = '0'
    }

    openResultsScreen = (results) => {
        this.querySelector('.results-screen').style.height = '100%'
        this.querySelector('.results-screen mrp-results').fill(results)
    }
}

if ('customElements' in window) {
    customElements.define(App.TAG, App)
}