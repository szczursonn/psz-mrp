import { createElement, LABELS } from "../utils.mjs"

class Results extends HTMLElement {
    static TAG = 'mrp-results'

    blankZeroes = true

    connectedCallback() {
        this.clear()
    }

    clear() {
        this.innerHTML = `
            <div class="container">
                <h2 class="text-center">${LABELS.RESULTS}</h2>
                <div>
                    <input class="form-check-input" type="checkbox" ${this.blankZeroes ? 'checked' : ''}>
                    <label class="form-check-label">${LABELS.HIDE_ZEROES}</label>
                </div>
                <hr />
                <div class="results-container">
                    <h3>GHP</h3>
                    <table class="table table-bordered border-dark">
                        <thead class="table-dark">
                            <tr>
                                <th scope="row">${LABELS.PERIOD}</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            <tr x-row-type="demand">
                                <th>${LABELS.EXPECTED_DEMAND}</th>
                            </tr>
                            <tr x-row-type="production">
                                <th>${LABELS.PRODUCTION}</th>
                            </tr>
                            <tr x-row-type="available">
                                <th>${LABELS.AVAILABLE}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `
        this.querySelector('input[type="checkbox"]').addEventListener('click', (e) => {
            this.toggleZeroes()
        })
    }

    toggleZeroes() {
        if (this.blankZeroes) {
            this.showZeroes()
        } else {
            this.hideZeroes()
        }
    }

    showZeroes() {
        this.blankZeroes = false
        Array.from(this.querySelectorAll('tbody td')).filter((el) => el.textContent === '0').forEach((el) => el.style.opacity = '100%')
    }

    hideZeroes() {
        this.blankZeroes = true
        Array.from(this.querySelectorAll('tbody td')).filter((el) => el.textContent === '0').forEach((el) => el.style.opacity = '0%')
        // ignore expected stock
        Array.from(this.querySelectorAll('tbody tr[x-field="expectedStock"]')).forEach((row) => {
            for (const el of row.children) {
                el.style.opacity = ''
            }
        })
        // ignore ghp available
        Array.from(this.querySelectorAll('tbody tr[x-row-type="available"]')).forEach((row) => {
            for (const el of row.children) {
                el.style.opacity = ''
            }
        })
    }

    fill(results) {
        this.clear()
        const resultsContainer = this.querySelector('.results-container')

        this.querySelector('.results-container h3').textContent = results.ghp.name + ' (GHP)'

        const ghpPeriodRow = this.querySelector('thead tr')
        const ghpDemandRow = this.querySelector('tr[x-row-type="demand"]')
        const ghpProductionRow = this.querySelector('tr[x-row-type="production"]')
        const ghpAvailableRow = this.querySelector('tr[x-row-type="available"]')

        let lastAvailable
        for (let i = 0; i < results.ghp.demand.length; i++) {
            createElement('td', {
                attributes: {
                    scope: 'row'
                },
                className: 'fw-bold',
                textContent: i + 1,
                parent: ghpPeriodRow
            })

            createElement('td', {
                attributes: {
                    scope: 'row'
                },
                textContent: results.ghp.demand[i],
                parent: ghpDemandRow
            })

            createElement('td', {
                attributes: {
                    scope: 'row'
                },
                textContent: results.ghp.production[i],
                parent: ghpProductionRow
            })
            const available = i === 0 ? results.ghp.stock : lastAvailable - results.ghp.demand[i] + results.ghp.production[i]
            lastAvailable = available
            createElement('td', {
                attributes: {
                    scope: 'row'
                },
                textContent: available,
                parent: ghpAvailableRow
            })
        }

        results.mrps.sort((a, b) => a.bomLevel - b.bomLevel)

        for (const mrp of results.mrps) {
            createElement('h3', {
                textContent: mrp.name,
                parent: resultsContainer
            })
            createElement('h5', {
                textContent: `${LABELS.BOM_LEVEL}: ${mrp.bomLevel}`,
                parent: resultsContainer
            })
            createElement('h6', {
                textContent: `${LABELS.MAKE_TIME}: ${mrp.makeTime}, ${LABELS.IN_STOCK}: ${mrp.result[0].expectedStock}, ${LABELS.MULTIPLIER}: ${mrp.demandMultiplier}, ${LABELS.BATCH_SIZE}: ${mrp.batchSize}, ${LABELS.PART_OF} ${mrp.parentName}`,
                parent: resultsContainer
            })

            const mrpTableEl = createElement('table', {
                className: 'table table-bordered border-dark',
                parent: resultsContainer
            })

            const periodRow = createElement('tr', {
                parent: createElement('thead', {
                    className: 'table-dark',
                    parent: mrpTableEl
                })
            })

            createElement('th', {
                attributes: {
                    scope: 'row'
                },
                textContent: LABELS.PERIOD,
                parent: periodRow
            })

            for (let i = 0; i < mrp.result.length; i++) {
                createElement('th', {
                    textContent: i + 1,
                    parent: periodRow
                })
            }

            const mrpTableBodyEl = createElement('tbody', {
                className: 'table-group-divider',
                parent: mrpTableEl
            })

            const magic = (field, label) => {
                const row = createElement('tr', {
                    attributes: {
                        'x-field': field
                    },
                    parent: mrpTableBodyEl
                })
                createElement('th', {
                    attributes: {
                        scope: 'row'
                    },
                    textContent: label,
                    parent: row
                })

                for (const period of mrp.result) {
                    createElement('td', {
                        attributes: {
                            scope: 'row'
                        },
                        textContent: period[field],
                        parent: row
                    })
                }
            }

            // fuck clean code
            magic('fullDemand', LABELS.FULL_DEMAND)
            magic('plannedImports', LABELS.PLANNED_IMPORTS)
            magic('expectedStock', LABELS.EXPECTED_STOCK)
            magic('netDemand', LABELS.NET_DEMAND)
            magic('plannedOrders', LABELS.PLANNED_ORDERS)
            magic('plannedOrdersIntake', LABELS.PLANNED_ORDERS_INTAKE)
        }

        if (this.blankZeroes) {
            this.hideZeroes()
        }

    }

}

if ('customElements' in window) {
    customElements.define(Results.TAG, Results)
}
