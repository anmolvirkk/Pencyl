import styles from './_addLayer.module.sass'

const AddLayer = () => {
    return (
        <div className={styles.wrapper}>
            <input type='text' placeholder='Layer Name' />
            <button>Add</button>
        </div>
    )
}

export default AddLayer