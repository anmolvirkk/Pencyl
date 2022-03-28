import { atom } from "recoil";
import { recoilPersist } from "recoil-persist"

const {persistAtom} = recoilPersist()

const canvasAtom = atom({
    key: 'canvas',
    default: {
        style: {height: 600, width: 600, background: '#090909'}
    },
    effects: [persistAtom]
})

export default canvasAtom