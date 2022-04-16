import { atom } from "recoil"

const elementsAtom = atom({
    key: 'elements',
    default: {type: 'icons', content: {icons: [], images: [], text: [], uploaded: []}}
})

export default elementsAtom