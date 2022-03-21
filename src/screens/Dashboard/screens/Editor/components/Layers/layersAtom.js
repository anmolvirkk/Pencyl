import { atom } from "recoil";
import { recoilPersist } from "recoil-persist"

const {persistAtom} = recoilPersist()

const layersAtom = atom({
    key: 'layers',
    default: {
        head: {
            sub: {
                    eyes: {
                        sub: {
                            glasses: {
                                assets: [
                                    {
                                        name: 'x',
                                        elem: null,
                                        rare: ''
                                    },
                                    {
                                        name: 'y',
                                        elem: null,
                                        rare: ''
                                    },
                                    {
                                        name: 'z',
                                        elem: null,
                                        rare: ''
                                    }
                                ]
                            }
                        }
                    },
                    nose: {
                        assets: [
                            {
                                name: 'x',
                                elem: null,
                                rare: ''
                            },
                            {
                                name: 'y',
                                elem: null,
                                rare: ''
                            }
                        ]
                    },
                    ears: {
                        assets: [
                            {
                                name: 'y',
                                elem: null,
                                rare: ''
                            },
                            {
                                name: 'z',
                                elem: null,
                                rare: ''
                            }
                        ]
                    }
                }
        },
        body: {
            assets: [
                {
                    name: 'x',
                    elem: null,
                    rare: ''
                },
                {
                    name: 'y',
                    elem: null,
                    rare: ''
                },
                {
                    name: 'z',
                    elem: null,
                    rare: ''
                }
            ]
        },
        arms: {
            sub: {
                forearm: {
                    sub: {
                        wrist: {
                            sub: {
                                fingers: {
                                    sub: {
                                        thumb: {
                                            sub: {
                                                nail: {
                                                    sub: {
                                                        colors: {
                                                            assets: [
                                                                {
                                                                    name: 'x',
                                                                    elem: null,
                                                                    rare: ''
                                                                },
                                                                {
                                                                    name: 'y',
                                                                    elem: null,
                                                                    rare: ''
                                                                },
                                                                {
                                                                    name: 'z',
                                                                    elem: null,
                                                                    rare: ''
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                hands: {
                    sub: {
                        accessories: {
                            assets: [
                                {
                                    name: 'x',
                                    elem: null,
                                    rare: ''
                                },
                                {
                                    name: 'y',
                                    elem: null,
                                    rare: ''
                                },
                                {
                                    name: 'z',
                                    elem: null,
                                    rare: ''
                                }
                            ]
                        }
                    }
                },
            }
        },
        legs: {
            assets: [
                {
                    name: 'a',
                    elem: null,
                    rare: ''
                },
                {
                    name: 'b',
                    elem: null,
                    rare: ''
                }
            ]
        },
        back: {
            
        }
    },
    effects: [persistAtom]
})

export default layersAtom