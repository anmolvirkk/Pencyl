import { atom } from "recoil";
import { recoilPersist } from "recoil-persist"

const {persistAtom} = recoilPersist()

const itemsAtom = atom({
    key: 'items',
    default: false,
    effects: [persistAtom]
})

export default itemsAtom