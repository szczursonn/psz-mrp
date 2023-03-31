import { createElement, LABELS } from "../utils.mjs"

class InputFormMRP extends HTMLElement {
    static TAG = 'input-form-mrp'

    connectedCallback() {
        this.innerHTML = `
        <div class="card mb-3">
            <button class="btn btn-danger btn-sm position-absolute top-0 end-0 mt-2 me-2" type="button" x-btn-type="remove">${LABELS.REMOVE}</button>
            <div class="card-body row">
                <div class="col-6">
                    <label class="form-label">${LABELS.NAME}</label>
                    <input class="form-control" type="text" x-field="name" required>
                </div>
                <div class="col-6">
                    <label class="form-label">${LABELS.PART_OF}</label>
                    <select class="form-control" type="number" x-field="parent" required></select>
                </div>
                <div class="col-12 col-sm-3">
                    <label class="form-label">${LABELS.IN_STOCK}</label>
                    <input class="form-control" type="number" x-field="stock" min=0 value=0 required>
                </div>
                <div class="col-12 col-sm-3">
                    <label class="form-label">${LABELS.MAKE_TIME}</label>
                    <input class="form-control" type="number" x-field="maketime" min=0 value=1 required>
                </div>
                <div class="col-12 col-sm-3">
                    <label class="form-label">${LABELS.BATCH_SIZE}</label>
                    <input class="form-control" type="number" x-field="batchsize" min=1 value=10 required>
                </div>
                <div class="col-12 col-sm-3">
                    <label class="form-label">${LABELS.MULTIPLIER}</label>
                    <input class="form-control" type="number" x-field="multiplier" min=1 value=1 required>
                </div>
            </div>
        </div>
        `

        this.querySelector('button[x-btn-type="remove"]').addEventListener('click', this.removeForm.bind(this))

        this.querySelector('input[x-field="name"]').addEventListener('change', this.sendResyncEvent.bind(this))
    }

    get data() {
        return {
            name: this.querySelector('input[x-field="name"]').value,
            initialStock: this.querySelector('input[x-field="stock"]').valueAsNumber,
            makeTime: this.querySelector('input[x-field="maketime"]').valueAsNumber,
            batchSize: this.querySelector('input[x-field="batchsize"]').valueAsNumber,
            demandMultiplier: this.querySelector('input[x-field="multiplier"]').valueAsNumber,
            parent: this.querySelector('select[x-field="parent"]').value,
            id: this.getAttribute('x-mrp-id')
        }
    }

    removeForm() {
        this.sendResyncEvent()
        this.remove()
    }

    sendResyncEvent() {
        this.dispatchEvent(new CustomEvent('mrp changed', {
            bubbles: true
        }))
    }

    updateSelectParentOptions(newOptions) {
        const selectEl = this.querySelector('select[x-field="parent"]')
        const prevSelectedValue = selectEl.value

        while (selectEl.length > 0) {
            selectEl.remove(0)
        }

        for (const option of newOptions) {
            const optionEl = createElement('option', {
                attributes: {
                    label: option.label,
                    value: option.value
                }
            })
            selectEl.add(optionEl);
        }

        if (newOptions.find(opt => opt.value === prevSelectedValue)) {
            selectEl.value = prevSelectedValue
        }

    }
}

if ('customElements' in window) {
    customElements.define(InputFormMRP.TAG, InputFormMRP)
}
