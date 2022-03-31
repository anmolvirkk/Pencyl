import { atom } from "recoil";
import { recoilPersist } from "recoil-persist"

const {persistAtom} = recoilPersist()

const projectsAtom = atom({
    key: 'projects',
    default: {},
    effects: [persistAtom]
})

export default projectsAtom