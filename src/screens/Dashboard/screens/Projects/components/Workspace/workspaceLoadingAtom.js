import { atom } from "recoil"

const workspaceLoadingAtom = atom({
    key: 'workspaceLoading',
    default: false
})

export default workspaceLoadingAtom