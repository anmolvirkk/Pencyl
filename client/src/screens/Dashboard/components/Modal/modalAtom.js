import { atom } from "recoil"

const modalAtom = atom({
    key: 'modal',
    default: {type: null}
})

export default modalAtom