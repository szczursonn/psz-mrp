export class MRP {
    constructor({ name, makeTime, initialStock, demandMultiplier, batchSize }) {
        this.name = name
        this.makeTime = makeTime
        this.initialStock = initialStock
        this.demandMultiplier = demandMultiplier
        this.batchSize = batchSize
    }

    calculate(demandTable) {
        /*
            {
                fullDemand: int,
                plannedImports: int,
                expectedStock: int,
                netDemand: int,
                plannedOrders: int,
                plannedOrdersIntake: int
            }
        */
        const periods = demandTable.map((demand) => {
            return {
                fullDemand: demand * this.demandMultiplier,
                plannedImports: 0,
                expectedStock: 0,
                netDemand: 0,
                plannedOrders: 0,
                plannedOrdersIntake: 0
            }
        })

        let productionStartPtr = 0

        for (let i = 0; i < periods.length; i++) {
            const currentPeriod = periods[i]

            currentPeriod.expectedStock = i === 0 ? this.initialStock : periods[i - 1].expectedStock

            currentPeriod.expectedStock -= currentPeriod.fullDemand
            currentPeriod.netDemand = currentPeriod.expectedStock < 0 ? -currentPeriod.expectedStock : 0

            if (currentPeriod.netDemand > 0) {
                // order stuff
                while (currentPeriod.expectedStock < 0) {
                    if (productionStartPtr + this.makeTime > i) {
                        // production would end after current period, must import
                        currentPeriod.plannedImports = -currentPeriod.expectedStock
                        currentPeriod.expectedStock = 0
                    } else {
                        // schedule production
                        let productionEndPtr = productionStartPtr + this.makeTime
                        periods[productionStartPtr].plannedOrders = this.batchSize
                        periods[productionEndPtr].plannedOrdersIntake = this.batchSize

                        // update affected expected stock
                        for (let j = productionEndPtr; j <= i; j++) {
                            periods[j].expectedStock += this.batchSize
                        }

                        productionStartPtr += this.makeTime
                    }
                }
            }
        }
        return periods
    }
}