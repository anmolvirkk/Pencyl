import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"
const {persistAtom} = recoilPersist()

const activeProjectAtom = atom({
    key: 'activeProject',
    default: null,
    effects: [persistAtom]
})

export default activeProjectAtom