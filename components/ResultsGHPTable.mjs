import { LABELS, createElement } from "../utils.mjs"

class ResultsGHPTable extends HTMLElement {
    static TAG = 'results-ghp-table'

    connectedCallback() {
        this.innerHTML = `
            <h3>GHP</h3>
            <h6></h6>
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
        `
    }

    fill(ghp) {
        this.querySelector('h3').textContent = ghp.name + ' (GHP)'
        this.querySelector('h6').textContent = `${LABELS.MAKE_TIME}: ${ghp.makeTime}, ${LABELS.IN_STOCK}: ${ghp.stock}`

        let lastAvailable
        for (let i = 0; i < ghp.demand.length; i++) {
            createElement('td', {
                attributes: {
                    scope: 'row'
                },
                className: 'fw-bold',
                textContent: i + 1,
                parent: this.querySelector('thead tr')
            })

            createElement('td', {
                attributes: {
                    scope: 'row'
                },
                textContent: ghp.demand[i],
                parent: this.querySelector('tr[x-row-type="demand"]')
            })

            createElement('td', {
                attributes: {
                    scope: 'row'
                },
                textContent: ghp.production[i],
                parent: this.querySelector('tr[x-row-type="production"]')
            })
            const available = i === 0 ? ghp.stock : lastAvailable - ghp.demand[i] + ghp.production[i]
            lastAvailable = available
            createElement('td', {
                attributes: {
                    scope: 'row'
                },
                textContent: available,
                parent: this.querySelector('tr[x-row-type="available"]')
            })
        }
    }

    hideZeroes() {
        Array.from(this.querySelectorAll('tr[x-row-type]:not([x-row-type="available"]) td')).filter((el) => el.textContent === '0').forEach((el) => el.style.opacity = '0%')
    }

    showZeroes() {
        Array.from(this.querySelectorAll('td')).filter((el) => el.textContent === '0').forEach((el) => el.style.opacity = '100%')
    }

}

if ('customElements' in window) {
    customElements.define(ResultsGHPTable.TAG, ResultsGHPTable)
}
