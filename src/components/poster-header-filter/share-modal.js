import React, {useState} from 'react';
import { Modal } from 'react-bootstrap';

import styles from './share-modal.module.scss';


export default ({show, onHide, title, text, link}) => {
    const [copyText, setCopyText] = useState('Copy Link');

    const onCopy = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(link);
            setCopyText('Copied !');
            setTimeout(() => setCopyText('Copy Link'), 2000);
        }
    };

    return (
        <Modal show={show} onHide={onHide} dialogClassName={styles.modal}>
            <Modal.Header>
                <Modal.Title>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={styles.text}>{text}</div>
                <div className={styles.linkWrapper}>
                    <span className={styles.link}>{link}</span>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className={styles.dismiss} onClick={onHide}>Dismiss</button>
                <button className={styles.copy} onClick={onCopy}>{copyText}</button>
            </Modal.Footer>
        </Modal>
    );
}
