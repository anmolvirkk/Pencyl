import styles from './_addLayer.module.sass'

const AddLayer = () => {
    return (
        <div className={styles.wrapper}>
            <input type='text' placeholder='Layer Name' />
            <button>
                <p>Add</p>
            </button>
        </div>
    )
}

export default AddLayer