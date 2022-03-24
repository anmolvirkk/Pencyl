import { atom } from "recoil";
import { recoilPersist } from "recoil-persist"

const {persistAtom} = recoilPersist()

const detailsAtom = atom({
    key: 'details',
    default: {
        canvas: {
            style: {height: 600, width: 600}
        },
        assets: {}
    },
    effects: [persistAtom]
})

export default detailsAtom