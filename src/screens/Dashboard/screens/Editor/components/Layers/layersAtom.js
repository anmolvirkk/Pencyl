import { atom } from "recoil";
import { recoilPersist } from "recoil-persist"

const {persistAtom} = recoilPersist()

const layersAtom = atom({
    key: 'layers',
    default: {},
    effects: [persistAtom]
})

export default layersAtom