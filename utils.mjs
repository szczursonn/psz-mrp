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

export const TEST_PARAMS = {
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

export const REPO_URL = 'https://github.com/szczursonn/psz-mrp'