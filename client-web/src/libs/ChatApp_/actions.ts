import { useChatStore } from "./store_";

export function actionResync() {
    const store = useChatStore.getState()

    if (store.resyncing) {
        return store.resyncing
    }
}