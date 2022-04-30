import { atom } from "recoil"

const activeProjectAtom = atom({
    key: 'activeProject',
    default: null
})

export default activeProjectAtom