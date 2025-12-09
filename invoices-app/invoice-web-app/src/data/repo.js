import generateSampleData from 'invoice-repo/dist/invoice-repo-sample-data';
let globalRepo = null;
export function initializeGlobalRepo() {
    if (!globalRepo) {
        globalRepo = generateSampleData();
    }
    return globalRepo;
}
export function getGlobalRepo() {
    if (!globalRepo) {
        return initializeGlobalRepo();
    }
    return globalRepo;
}
export function resetGlobalRepo() {
    globalRepo = null;
}
//# sourceMappingURL=repo.js.map