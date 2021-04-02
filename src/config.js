module.exports = {
    rules: {
        excludeOperations: [
            "Mutation",
            "Subscription"
        ],
        excludeFields: [
            "trackedWallets",
            "currentSnarkWorker",
            "initialPeers",
            "wallet"
        ],
        excludeTypes: [
            "mutation",
            "subscription"
        ]
    }
}