import "./InputFormGHP.mjs"
import "./InputFormMRP.mjs"
import { createElement, LABELS } from "../utils.mjs"

class InputForm extends HTMLElement {
    static TAG = 'input-form'

    mrpIdCounter = 0

    connectedCallback() {
        this.innerHTML = `
            <div class="container mt-4">
                <h2 class="text-center">${LABELS.INPUT_FORM_TITLE}</h2>
                <form>
                    <h3>GHP</h3>
                    <input-form-ghp></input-form-ghp>
                    <hr />
                    <span class="d-flex align-items-center mb-1">
                        <h3 class="mb-0">MRP</h3>
                        <button class="btn btn-light ms-2" type="button" x-btn-type="add">+</button>
                    </span>
                    <div class="row mrp-container"></div>
                    <hr />
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary mt-1" type="submit">${LABELS.CALCULATE}</button>
                    </div>
                </form>
            </div>
        `

        this.querySelector('form span button[x-btn-type="add"]').addEventListener('click', this.addMRPForm.bind(this))

        this.querySelector('form').addEventListener('submit', this.handleSubmit)

        this.addEventListener('mrp changed', (e) => {
            e.stopPropagation()
            // .remove() is async for some reason
            setTimeout(this.syncMRPParentSelectOptions.bind(this), 0)
        })

        this.addMRPForm()
    }

    addMRPForm() {
        createElement('input-form-mrp', {
            className: 'col-12',
            attributes: {
                'x-mrp-id': (this.mrpIdCounter++).toString()
            },
            parent: this.querySelector('form .mrp-container')
        })
        // xd
        setTimeout(this.syncMRPParentSelectOptions.bind(this), 0)
    }

    syncMRPParentSelectOptions() {
        const forms = Array.from(this.querySelectorAll('input-form-mrp'))
        const options = forms.map((el) => [el.data.name, el.getAttribute('x-mrp-id')]).filter(([name, mrpId]) => !!name).map(([name, mrpId]) => {
            return {
                label: name,
                value: mrpId
            }
        })
        options.unshift({ label: 'GHP', value: 'GHP' })

        // TODO: Disallow loops
        for (const inputFormEl of forms) {
            const filteredOptions = options.filter(({ value }) => value !== inputFormEl.getAttribute('x-mrp-id'))
            inputFormEl.updateSelectParentOptions(filteredOptions)
        }
    }

    handleSubmit(e) {
        e.preventDefault()

        const ghp = this.querySelector('form input-form-ghp').data
        const mrps = Array.from(this.querySelectorAll('form input-form-mrp')).map((el) => el.data)

        // TODO: validation

        this.dispatchEvent(new CustomEvent('mrp submit', {
            bubbles: true,
            detail: {
                ghp,
                mrps
            }
        }))
    }
}

if ('customElements' in window) {
    customElements.define(InputForm.TAG, InputForm)
}
