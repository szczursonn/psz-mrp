import { LABELS, createElement } from "../utils.mjs"

class ResultsMRPTable extends HTMLElement {
    static TAG = 'results-mrp-table'

    connectedCallback() {
        this.innerHTML = `
            <h3></h3>
            <h5></h5>
            <h6></h6>
            <table class="table table-bordered border-dark">
                <thead class="table-dark">
                    <tr>
                        <th scope="row">${LABELS.PERIOD}</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">

                </tbody>
            </table>
        `
    }

    fill(mrp) {

        this.querySelector('h3').textContent = mrp.name
        this.querySelector('h5').textContent = `${LABELS.BOM_LEVEL}: ${mrp.bomLevel}`
        this.querySelector('h6').textContent = `${LABELS.MAKE_TIME}: ${mrp.makeTime}, ${LABELS.IN_STOCK}: ${mrp.initialStock}, ${LABELS.MULTIPLIER}: ${mrp.demandMultiplier}, ${LABELS.BATCH_SIZE}: ${mrp.batchSize}, ${LABELS.PART_OF} ${mrp.parentName}`

        for (let i = 0; i < mrp.result.length; i++) {
            createElement('th', {
                textContent: i + 1,
                parent: this.querySelector('thead tr')
            })
        }

        const createRow = (field, label) => {
            const row = createElement('tr', {
                attributes: {
                    'x-field': field
                },
                parent: this.querySelector('tbody')
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
                    style: ((field === 'plannedImports' && period[field] > 0) || field === 'expectedStock' && period[field] < 0) ? 'color: red; font-weight: bold;' : undefined,
                    parent: row
                })
            }
        }

        createRow('fullDemand', LABELS.FULL_DEMAND)
        createRow('plannedImports', LABELS.PLANNED_IMPORTS)
        createRow('expectedStock', LABELS.EXPECTED_STOCK)
        createRow('netDemand', LABELS.NET_DEMAND)
        createRow('plannedOrders', LABELS.PLANNED_ORDERS)
        createRow('plannedOrdersIntake', LABELS.PLANNED_ORDERS_INTAKE)
    }

    hideZeroes() {
        Array.from(this.querySelectorAll('tr[x-field]:not([x-field="expectedStock"]) td')).filter((el) => el.textContent === '0').forEach((el) => el.style.opacity = '0%')
    }

    showZeroes() {
        Array.from(this.querySelectorAll('td')).filter((el) => el.textContent === '0').forEach((el) => el.style.opacity = '100%')
    }
}

if ('customElements' in window) {
    customElements.define(ResultsMRPTable.TAG, ResultsMRPTable)
}
