export const createElement = (tag, { textContent, className, style, attributes, parent } = {}) => {
    const el = document.createElement(tag)
    if (textContent !== undefined) {
        el.textContent = textContent
    }
    if (className !== undefined) {
        el.className = className
    }
    if (style !== undefined) {
        el.style.cssText = style
    }
    if (attributes !== undefined) {
        for (const [k, v] of Object.entries(attributes)) {
            el.setAttribute(k, v)
        }
    }
    if (parent !== undefined) {
        parent.appendChild(el)
    }
    return el
}

export const LABELS = {
    NAME: 'Nazwa',
    IN_STOCK: 'Na stanie',
    MAKE_TIME: 'Czas realizacji',
    BATCH_SIZE: 'Wielkość partii',
    EXPECTED_DEMAND: 'Przewidywany popyt',
    PERIOD: 'Okres',
    REMOVE: 'Usuń',
    CALCULATE: 'Wylicz',
    PART_OF: 'Część elementu:',
    MULTIPLIER: 'Mnożnik',
    PRODUCTION: 'Produkcja',
    AVAILABLE: 'Dostępne',
    RESULTS: 'Wyniki',
    BOM_LEVEL: 'Poziom BOM',
    FULL_DEMAND: 'Pełne zapotrzebowanie',
    PLANNED_IMPORTS: 'Planowane przyjęcia',
    EXPECTED_STOCK: 'Przewidywane na stanie',
    NET_DEMAND: 'Zapotrzebowanie netto',
    PLANNED_ORDERS: 'Planowane zamówienia',
    PLANNED_ORDERS_INTAKE: 'Planowane przyjęcie zamówień',
    BACK: 'Powrót',
    INPUT_FORM_TITLE: 'Wprowadź dane',
    HIDE_ZEROES: 'Ukryj zera'
}