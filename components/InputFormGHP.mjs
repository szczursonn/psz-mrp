import { createElement, LABELS } from "../utils.mjs"

class InputFormGHP extends HTMLElement {
    static TAG = 'input-form-ghp'
    static DEFAULT_PERIOD_AMOUNT = 10

    connectedCallback() {
        this.innerHTML = `
            <div class="row mb-3">
                <div class="col-12 mb-2">
                    <label class="form-label">${LABELS.NAME}</label>
                    <input class="form-control" type="text" x-field="name" required>
                </div>
                <div class="col-12 col-sm-6">
                    <label class="form-label">${LABELS.IN_STOCK}</label>
                    <input class="form-control" type="number" x-field="stock" min=0 value=0 required>
                </div>
                <div class="col-12 col-sm-6">
                    <label class="form-label">${LABELS.MAKE_TIME}</label>
                    <input class="form-control" type="number" x-field="maketime" min=1 value=1 required>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col" style="display: flex; align-items: center;">
                                <button class="btn btn-light fw-bold me-1" type="button" x-btn-type="remove-period">-</button>
                                ${LABELS.PERIOD}
                                <button class="btn btn-light fw-bold ms-1" type="button" x-btn-type="add-period">+</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr x-row-type="demand">
                            <th scope="row">
                                ${LABELS.EXPECTED_DEMAND}
                            </th>
                        </tr>
                        <tr x-row-type="production">
                            <th scope="row">
                                ${LABELS.PRODUCTION}
                            </th>
                        </tr>
                        <tr x-row-type="available">
                            <th scope="row">
                                ${LABELS.AVAILABLE}
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p style="display: none;" class="fw-bold text-warning mt-2 ghp-production-ignored-warning">⚠️ ${LABELS.IGNORED_PRODUCTION_WARNING}</p>
        `

        for (let i = 0; i < InputFormGHP.DEFAULT_PERIOD_AMOUNT; i++) {
            this.addPeriod()
        }
        this.updateAvailableRow()

        this.querySelector('thead button[x-btn-type="add-period"]').addEventListener('click', this.addPeriod.bind(this))
        this.querySelector('thead button[x-btn-type="remove-period"]').addEventListener('click', this.removePeriod.bind(this))
        this.querySelector('input[x-field="stock"]').addEventListener('change', this.updateAvailableRow.bind(this))
        this.querySelector('input[x-field="maketime"]').addEventListener('change', this.updateProductionIgnoredWarning.bind(this))
    }

    get data() {
        return {
            name: this.querySelector('input[x-field="name"]').value,
            stock: this.querySelector('input[x-field="stock"]').valueAsNumber,
            makeTime: this.querySelector('input[x-field="maketime"]').valueAsNumber,
            demand: Array.from(this.querySelectorAll('tbody tr[x-row-type="demand"] input')).map((el) => el.valueAsNumber).map((val) => isNaN(val) ? 0 : val),
            production: Array.from(this.querySelectorAll('tbody tr[x-row-type="production"] input')).map((el) => el.valueAsNumber).map((val) => isNaN(val) ? 0 : val)
        }
    }

    addPeriod() {
        const nextPeriodNumber = this.querySelector('thead tr').children.length

        createElement('th', {
            attributes: {
                scope: 'col'
            },
            textContent: nextPeriodNumber,
            parent: this.querySelector('thead tr')
        })

        const demandInputEl = createElement('input', {
            attributes: {
                type: 'number',
                min: 0
            },
            style: `max-width: 100px;`,
            parent: createElement('td', {
                attributes: {
                    scope: 'row'
                },
                parent: this.querySelector('tbody tr[x-row-type="demand"]')
            })
        })

        const productionInputEl = createElement('input', {
            attributes: {
                type: 'number',
                min: 0
            },
            style: `max-width: 100px;`,
            parent: createElement('td', {
                attributes: {
                    scope: 'row'
                },
                parent: this.querySelector('tbody tr[x-row-type="production"]')
            })
        })

        createElement('td', {
            attributes: {
                scope: 'row'
            },
            textContent: 'jd',
            parent: this.querySelector('tbody tr[x-row-type="available"]')
        })

        this.updateAvailableRow()

        demandInputEl.addEventListener('change', this.updateAvailableRow.bind(this))
        productionInputEl.addEventListener('change', this.updateAvailableRow.bind(this))
        productionInputEl.addEventListener('change', this.updateProductionIgnoredWarning.bind(this))
    }

    removePeriod() {
        const headRow = this.querySelector('thead tr')
        const bodyRows = this.querySelectorAll('tbody tr')
        if (headRow.children.length > 2) {
            headRow.removeChild(headRow.lastChild)
            for (const row of bodyRows) {
                row.removeChild(row.lastChild)
            }
        }
    }

    updateAvailableRow() {
        const cells = Array.from(this.querySelector('tbody tr[x-row-type="available"]').children).splice(1)

        const data = this.data

        for (let i = 0; i < cells.length; i++) {
            cells[i].textContent = (i === 0 ? data.stock : parseInt(cells[i - 1].textContent)) - data.demand[i] + data.production[i]
        }
    }

    updateProductionIgnoredWarning() {
        const warningEl = this.querySelector('.ghp-production-ignored-warning')
        const makeTime = this.querySelector('input[x-field="maketime"]').valueAsNumber

        if (isNaN(makeTime)) {
            return
        }

        const ignoredProductionInputs = Array.from(this.querySelectorAll('tbody tr[x-row-type="production"] input')).splice(0, makeTime)

        for (const inputEl of ignoredProductionInputs) {
            if (!isNaN(inputEl.valueAsNumber) && inputEl.valueAsNumber !== 0) {
                warningEl.style.display = 'block'
                return
            }
        }

        warningEl.style.display = 'none'
    }
}

if ('customElements' in window) {
    customElements.define(InputFormGHP.TAG, InputFormGHP)
}
