import { createElement, LABELS } from "../utils.mjs"
import "./ResultsGHPTable.mjs"
import "./ResultsMRPTable.mjs"

class Results extends HTMLElement {
    static TAG = 'mrp-results'

    shouldShowZeroes = false

    connectedCallback() {
        this.clear()
    }

    clear() {
        this.innerHTML = `
            <div class="container">
                <h2 class="text-center">${LABELS.RESULTS}</h2>
                <div>
                    <input class="form-check-input" type="checkbox" ${this.shouldShowZeroes ? '' : 'checked'}>
                    <label class="form-check-label">${LABELS.HIDE_ZEROES}</label>
                </div>
                <hr />
                <div class="results-container"></div>
            </div>
        `
        this.querySelector('input[type="checkbox"]').addEventListener('click', (e) => {
            this.toggleZeroes()
        })
    }

    toggleZeroes() {
        if (this.shouldShowZeroes) {
            this.hideZeroes()
        } else {
            this.showZeroes()
        }
    }

    showZeroes() {
        this.shouldShowZeroes = true
        this.querySelector('results-ghp-table').showZeroes()
        this.querySelectorAll('results-mrp-table').forEach((el) => el.showZeroes())
    }

    hideZeroes() {
        this.shouldShowZeroes = false
        this.querySelector('results-ghp-table').hideZeroes()
        this.querySelectorAll('results-mrp-table').forEach((el) => el.hideZeroes())
    }

    fill(results) {
        this.clear()
        results.mrps.sort((a, b) => a.bomLevel - b.bomLevel)

        const resultsContainer = this.querySelector('.results-container')

        const resultsGhpTableEl = createElement('results-ghp-table', {
            parent: resultsContainer
        })
        setTimeout(() => {
            resultsGhpTableEl.fill(results.ghp)
            if (!this.shouldShowZeroes) {
                resultsGhpTableEl.hideZeroes()
            }
        }, 0)

        for (const mrp of results.mrps) {
            createElement('hr', {
                parent: resultsContainer
            })

            const resultsMrpTableEl = createElement('results-mrp-table', {
                parent: resultsContainer
            })
            setTimeout(() => {
                resultsMrpTableEl.fill(mrp)
                if (!this.shouldShowZeroes) {
                    resultsMrpTableEl.hideZeroes()
                }
            }, 0)
        }
    }
}

if ('customElements' in window) {
    customElements.define(Results.TAG, Results)
}
