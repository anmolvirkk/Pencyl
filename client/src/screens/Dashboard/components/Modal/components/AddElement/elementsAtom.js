import { atom } from "recoil";
import { recoilPersist } from "recoil-persist"

const {persistAtom} = recoilPersist()

const elementsAtom = atom({
    key: 'elements',
    default: {type: 'icons', content: {icons: [], images: [], text: [], uploaded: []}},
    effects: [persistAtom]
})

export default elementsAtom