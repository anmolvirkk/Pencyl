import { atom } from "recoil"

const searchAtom = atom({
    key: 'search',
    default: ''
})

export default searchAtom