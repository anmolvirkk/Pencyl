import { atom } from "recoil";
import { recoilPersist } from "recoil-persist"

const {persistAtom} = recoilPersist()

const modalAtom = atom({
    key: 'modal',
    default: {type: null},
    effects: [persistAtom]
})

export default modalAtom